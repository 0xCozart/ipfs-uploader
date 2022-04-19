declare module 'mime';

interface MetaDataSchema {
  name: string;
  description: string;
  image: string;
  properties: {trait_type: string; value: string}[];
}

export {MetaDataSchema};
