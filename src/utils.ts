import {MetaDataSchema} from '../types';

const setMetaDataSchema = (
  name: string,
  description: string,
  image: string,
  properties: {trait_type: string; value: string}[]
): MetaDataSchema => ({
  name,
  description,
  image,
  properties,
});

export {setMetaDataSchema};
