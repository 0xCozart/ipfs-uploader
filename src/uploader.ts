import fs from 'fs-extra';
import {getType} from 'mime';
import {File, NFTStorage} from 'nft.storage';
import * as path from 'path';
import {DataTypes, Sequelize} from 'sequelize';
import CID from '../db/';

class Uploader {
  private folderPath: string;
  // eslint-disable-next-line
  private jsonSchema: ReturnType<() => any>;
  private storage: NFTStorage;
  private db: Sequelize;
  private model: typeof CID | null;

  constructor(_folderpath: string, token: string, db_url: string) {
    this.folderPath = path.resolve(_folderpath);
    this.jsonSchema = fs.readJsonSync(_folderpath + '/schema.json');
    this.storage = new NFTStorage({token});
    this.db = new Sequelize(db_url);
    if (this.db !== undefined) {
      this.model = CID.init(
        {
          id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: false,
            primaryKey: true,
          },
          cid: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        {
          tableName: 'cids',
          sequelize: this.db,
        }
      );
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

  private async getFileList() {
    const files = await fs.readdir(this.folderPath);
    return files.filter(file => {
      if (file.endsWith('.jpg')) {
        return path.resolve(__dirname, '../assets/', file);
      }
    });
  }

  async upload() {}
}

export default Uploader;
