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

const parser = require('@asyncapi/parser');
const { generateMermaidDiagram } = require('../../helpers/mermaidDiagram.js');
const dummySpecUrl = 'https://rawcdn.githack.com/asyncapi/generator/v1.0.1/test/docs/dummy.yml';

describe('generateMermaidDiagram()', () => {
  it('generates correct diagram', async () => {
    const expectedDiagram = 'classDiagramclass dummy {          string}          class dummyCreated {          prop1 integerprop2 stringsentAt stringdummyArrayWithObject arraydummyArrayWithArray arraydummyObject object}          dummyCreated --|> sentAtdummyCreated --|> dummyArrayWithObjectdummyCreated --|> dummyArrayWithArraydummyCreated --|> dummyObjectclass sentAt {          string}          class dummyArrayWithObject {          array}          dummyArrayWithObject --|> dummyInfoclass dummyInfo {          prop1 stringsentAt string}          dummyInfo --|> sentAtclass dummyObject {          dummyObjectProp1 stringdummyObjectProp2 object}          dummyObject --|> sentAtdummyObject --|> dummyRecursiveObjectclass dummyRecursiveObject {          dummyRecursiveProp1 [CIRCULAR] objectdummyRecursiveProp2 string}          dummyRecursiveObject --|> dummyObject';
    const parsedAsyncapiDoc = await parser.parseFromUrl(dummySpecUrl);
    const diagram = generateMermaidDiagram(parsedAsyncapiDoc);
    //regex is for removing new lines and other stuff to get diagram in one line for easier testing with expectedDiagram
    expect(diagram.replace(/(\r\n|\n|\r)/gm, '')).toEqual(expectedDiagram);
  });

  it('generation fails as parsed asyncapi file is not passed to the function', async () => {
    expect(() => generateMermaidDiagram('test')).toThrow('You need to pass entire parsed AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"');
  });

  it('generation fails as no argument is passed to the function', async () => {
    expect(() => generateMermaidDiagram()).toThrow('You need to pass entire parsed AsyncAPI document as an argument. Try this "{{ asyncapi | generateMermaidDiagram }}"');
  });
});

