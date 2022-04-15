import * as dotenvSafe from 'dotenv-safe';
import path from 'path';

dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example'),
});

export const {NFTSTORAGEKEY, POSTGRES_URL} = <{[key: string]: string}>(
  process.env
);
