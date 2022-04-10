import fs from 'fs-extra';
import * as path from 'path';

class LocalFileHandler {
  folderPath: string;
  // eslint-disable-next-line
  jsonSchema: ReturnType<() => any>;

  constructor(private readonly _folderpath: string) {
    this.folderPath = path.resolve(_folderpath);
    this.jsonSchema = fs.readJsonSync(this.folderPath);
  }

  async getFile(): Promise<File> {
    const content = await fs.promises.readFile(this.filePath);
    const type = getType(this.filePath);
    return new File([content], path.basename(this.filePath), {type});
  }
}

export default LocalFileHandler;
