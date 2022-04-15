import {Model} from 'sequelize';

class CID extends Model {
  public id!: number;
  public cid!: string;
}

export default CID;
