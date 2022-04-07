import * as dotenvSafe from 'dotenv-safe';
import path from 'path';

dotenvSafe.config({
  path: path.resolve(__dirname, '..', '.env'),
  example: path.resolve(__dirname, '..', '.env.example'),
});

export const {NFTSTORAGEKEY} = <{[key: string]: string}>process.env;
