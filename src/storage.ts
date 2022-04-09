import fs from 'fs';
import {getType} from 'mime';
import {File, NFTStorage} from 'nft.storage';
import path from 'path';
import {NFTSTORAGEKEY} from '../constants';

async function storeNFT(imagePath: string, name: string, description: string) {
  const image = await fileFromPath(imagePath);

  const nftstorage = new NFTStorage({token: NFTSTORAGEKEY});

  return nftstorage.store({image, name, description});
}

async function fileFromPath(filePath: string) {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const content = await fs.promises.readFile(filePath);
  const type = getType(filePath);
  return new File([content], path.basename(filePath), {type});
}

export {storeNFT};
