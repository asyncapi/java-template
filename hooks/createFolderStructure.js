
const path = require('path');
const fs = require('fs');

module.exports = {
  'generate:before': createFolderStructure
};


async function createFolderStructure(generator){
  const targetDir = generator.targetDir;
  const packageDir = targetDir + '/com/ibm/mq/samples/jms'


  console.log(generator);
  console.log("GENERATORRRRRRR")
  
  fs.mkdirSync(packageDir, {recursive: true});
  fs.mkdirSync(targetDir + '/com/ibm/mq/samples/jms/models');
}