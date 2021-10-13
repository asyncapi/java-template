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

const { existsSync } = require('fs');
const path = require('path');
const Generator = require('@asyncapi/generator');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';
//you always want to generate to new directory to make sure test runs in clear environment
const outputDir = path.resolve('test/temp/generateExtraFormats', Math.random().toString(36).substring(7));

describe('generateExtraFormats()', () => {
  jest.setTimeout(30000);

  beforeAll(async() => {
    const generator = new Generator(path.resolve(__dirname, '../../'), outputDir, { 
      forceWrite: true,
      templateParams: {
        svg: 'true',
        png: 'true',
        pdf: 'true'
      }
    });
    await generator.generateFromURL(dummySpecUrl);
  });
  
  it('svg diagram file is generated', async () => {
    const svg = existsSync(path.join(outputDir, 'index.svg'));
    expect(svg).toBeTruthy();
  });

  it('png diagram file is generated', async () => {
    const png = existsSync(path.join(outputDir, 'index.png'));
    expect(png).toBeTruthy();
  });

  it('pdf diagram file is generated', async () => {
    const pdf = existsSync(path.join(outputDir, 'index.pdf'));
    expect(pdf).toBeTruthy();
  });
});
  