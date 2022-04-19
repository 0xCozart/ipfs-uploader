import fs from 'fs-extra';
import {getType} from 'mime';
import {File, NFTStorage} from 'nft.storage';
import * as path from 'path';
import {DataTypes, Sequelize} from 'sequelize';
import {NAME_PREFIX, TABLENAME} from '../constants';
import CID from '../db/';
import {MetaDataSchema} from '../types';
import {setMetaDataSchema} from './utils';

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

  /**
   * Stores Nft + metadata to IPFS and returns the CID.
   * Uploads all files in the assets directory to the NFT storage.
   * TODO: fix properties type to be more dynamic.
   * @param filePath: path to the file to be stored.
   * @param name: name of the NFT (collection name + id).
   * @param description: description of the NFT colleciton.
   * @param properties: properties of the NFT.
   * @returns {Promise<{CID}>}
   * @throws {Error}
   */
  private async storeNFT(metadata: MetaDataSchema) {
    const image = await this.fileFromPath(metadata.imagePath);

    return this.storage.store({...metadata, image});
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

  /**
   * Uploads all files in the assets directory to IPFS and stores CID in Postgres.
   * TODO: properties manager.
   * ?: not sure if should refactor for performance.
   */
  async uploadFiles() {
    const fileList = await this.getImageFileList();
    if (fileList.length === 0) {
      console.log('No image files found');
      return;
    }
    for (const filePath of fileList) {
      const id = path.basename(filePath, '.jpg');
      const name = `${NAME_PREFIX} ${id}`;
      const metadata = setMetaDataSchema(
        name,
        this.jsonSchema.description,
        filePath,
        this.jsonSchema.properties
      );
      const cid = await this.storeNFT(metadata);
      if (this.model !== null) {
        console.log({name, cid});
        await this.model.create({ID: parseInt(name), CID: cid.url});
      }
    }
    console.log('Upload complete!');
  }
}

export default Uploader;
