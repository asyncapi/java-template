/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

const fs = require('fs');

module.exports = {
  'generate:before': createFolderStructure
};

async function createFolderStructure(generator) {
  const packagePath = `/${generator.templateParams.package.split('.').join('/')}/`;

  const targetDir = generator.targetDir;
  const packageDir = targetDir + packagePath;
  const modelDir = `${targetDir + packagePath}models`;

  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, {recursive: true});
  }

  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(`${targetDir + packagePath}models`);
  }
}