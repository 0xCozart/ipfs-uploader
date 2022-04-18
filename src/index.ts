import {ASSETS_PATH, NFTSTORAGE_TOKEN, POSTGRES_URL} from '../constants';
import Uploader from './uploader';

async function main() {
  const uploader = new Uploader(ASSETS_PATH, NFTSTORAGE_TOKEN, POSTGRES_URL);
  await uploader.uploadFiles().then(console.log);
}

main().catch(console.error);
