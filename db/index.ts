import {Model} from 'sequelize';

class CID extends Model {
  declare ID: number | string;
  declare CID: string;
}

export default CID;
