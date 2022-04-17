import {Model} from 'sequelize';

class CID extends Model {
  declare ID: number | string;
  declare ImageCID: string;
  declare MetadataCID: string;
}

export default CID;
