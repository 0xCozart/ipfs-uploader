import {expect} from 'chai';
import 'mocha';
import {DataTypes, Sequelize} from 'sequelize';
import {POSTGRES_URL, TABLENAME} from '../constants';
import CID from '../db';

describe('Postgresql feature', () => {
  let sequelize: Sequelize;
  let model: typeof CID | null;

  before(() => {
    sequelize = new Sequelize(POSTGRES_URL);
    model = CID.init(
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
        sequelize: sequelize,
      }
    );
  });

  it('should store id and cid', () => {
    const id = 3231;
    const cid =
      'ipfs://bafyreidspexfuk7u23lzu2uqj6ikqubckus3zohunjcdiwr3l2qly6u7iy/metadata.json';
    const query = model?.findOne({where: {ID: id}});
    console.log({query});
    expect(query).to.equal(cid);
  });
});
