const path = require('path');
const fs = require('fs');

module.exports = {
  'generate:before': createFolderStructure
};


async function createFolderStructure(generator){
  const packagePath = "/" + generator.templateParams.package.split('.').join('/') + "/";

  const targetDir = generator.targetDir;
  const packageDir = targetDir + packagePath;

  fs.mkdirSync(packageDir, {recursive: true});
  fs.mkdirSync(targetDir + packagePath + 'models');
}