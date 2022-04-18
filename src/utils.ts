import fs from 'fs-extra';
import {getType} from 'mime';
import {File, NFTStorage} from 'nft.storage';
import path from 'path';
import {NFTSTORAGE_TOKEN} from '../constants';

async function storeNFT(imagePath: string, name: string, description: string) {
  const image = await fileFromPath(imagePath);

  const nftstorage = new NFTStorage({token: NFTSTORAGE_TOKEN});

  return nftstorage.store({image, name, description});
}

async function fileFromPath(filePath: string) {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const content = await fs.promises.readFile(filePath);
  const type = getType(filePath);
  return new File([content], path.basename(filePath), {type});
}

export {storeNFT};
