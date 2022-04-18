import * as dotenvSafe from 'dotenv-safe';
import path from 'path';

dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example'),
});

export const ASSETS_PATH = path.resolve(__dirname, '../', 'assets');

export const {NFTSTORAGE_TOKEN, POSTGRES_URL, TABLENAME} = <
  {[key: string]: string}
>process.env;
