NFT Storage Service w/ Postgresql
---
*Uploads ERC1155 compliant URI's to IPFS and stores returned CID in Postgresql.*

---

### Environment Variables: 

- NFTSTORAGE_TOKEN: API token retrieved from [nft.storage](https://nft.storage)
- POSTGRES_URL: Postgresql connection string
- TABLENAME: Postgresql table name (Table sync will be done automatically, so no need to manually create table within db)
- NAME_PREFIX: Collection name prefix i.e. `Amused Salamander Study Group #id`  
 (if left as empty string, will just display asset filename as name)

### Usage:
Loops through `.jpg` files in `./assets` directory and uploads to IPFS.
> Assets must be nameed `<UNIQUE NUMBER>.jpg`  (i.e. `1.jpg`, `2.jpg`, etc.)

TODO:
- Add support for other file types.
- Change int only file names to any string. 