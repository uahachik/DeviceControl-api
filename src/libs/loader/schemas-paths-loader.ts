import fs from 'fs';
import path from 'path';

const APPS_DIR = '/app/dist/src/apps';
const apiDirectories: string[] = [];

function searchApiDirectories(appsDir: string) {
  const entries = fs.readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(appsDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'api') {
        apiDirectories.push(fullPath);
      } else {
        searchApiDirectories(fullPath);
      }
    }
  }
  return apiDirectories;
}

function getDirSchemas(dir: string, filesList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  for (let idx = 0; idx < files.length; idx++) {
    const file = files[idx];
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      getDirSchemas(fullPath, filesList);
    } else {
      const fileName = path.basename(fullPath);
      const dirName = path.basename(path.dirname(fullPath));
      const schemaName = fileName.split('.')[0];
      if (dirName !== schemaName) {
        throw new Error('DIRECTORY NAME DOES NOT MATCH WITH SCHEMA NAME');
      }
      const schemaPattern = new RegExp(`^${dirName}\\.schema\\.js$`);
      if (schemaPattern.test(fileName)) {
        filesList.push(fullPath);
      }
    }
  }
  return filesList;
}

const schemasPathsLoader = () => {
  const apiDirs = searchApiDirectories(APPS_DIR);

  const schemasPaths = apiDirs.reduce((schemas: string[], apiDir) => {
    return schemas.concat(getDirSchemas(apiDir));
  }, []);

  if (apiDirectories.length === 0) {
    throw new Error('API DIRECTORIES NOT FOUND');
  }
  if (schemasPaths.length === 0) {
    throw new Error('SCHEMAS NOT FOUND');
  }
  return schemasPaths;
};

export default schemasPathsLoader;
