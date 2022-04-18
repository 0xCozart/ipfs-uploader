import fs from 'fs-extra';
import {getType} from 'mime';
import {File, NFTStorage} from 'nft.storage';
import * as path from 'path';
import {DataTypes, Sequelize} from 'sequelize';
import {TABLENAME} from '../constants';
import CID from '../db/';

class Uploader {
  private assetsPath: string;
  // eslint-disable-next-line
  private jsonSchema: ReturnType<() => any>;
  private storage: NFTStorage;
  private db: Sequelize;
  private model: typeof CID | null;

  constructor(assetsPath: string, token: string, db_url: string) {
    this.assetsPath = assetsPath;
    this.jsonSchema = fs.readJsonSync(
      path.resolve(__dirname, '..', 'metadataSchema.json')
    );
    this.storage = new NFTStorage({token});
    this.db = new Sequelize(db_url);
    if (this.db !== undefined) {
      this.model = CID.init(
        {
          ID: {
            type: DataTypes.INTEGER.UNSIGNED || DataTypes.STRING,
            autoIncrement: false,
            primaryKey: true,
          },
          CID: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
          tableName: TABLENAME,
          sequelize: this.db,
        }
      );
      this.model.sync();
    } else {
      this.model = null;
    }
  }

  private async storeNFT(imagePath: string, name: string, description: string) {
    const image = await this.fileFromPath(imagePath);

    return this.storage.store({image, name, description});
  }

  private async fileFromPath(filePath: string) {
    const content = await fs.promises.readFile(filePath);
    const type = getType(filePath);
    return new File([content], path.basename(filePath), {type});
  }

  private async getImageFileList() {
    const folder = await fs.readdir(this.assetsPath);
    const fileList: string[] = [];
    if (folder) {
      folder.filter(file => {
        if (file.endsWith('.jpg')) {
          fileList.push(path.resolve(this.assetsPath, file));
        }
      });
    }
    return fileList;
  }

  async uploadFiles() {
    const fileList = await this.getImageFileList();
    if (fileList.length === 0) {
      console.log('No image files found');
      return;
    }
    for (const file of fileList) {
      const name = path.basename(file, '.jpg');
      const description = this.jsonSchema.description;
      const cid = await this.storeNFT(file, name, description);
      if (this.model !== null) {
        console.log({name, cid});
        await this.model.create({ID: parseInt(name), CID: cid.url});
      }
    }
    console.log('Upload complete!');
  }
}

export default Uploader;
