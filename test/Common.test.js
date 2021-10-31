const testCommon = require('../components/Common');

const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const url = 'ibmmq://localhost:1414/QM1/DEV.APP.SVRCONN';
const params = {
  server: 'production'
};

const yaml = 'mocks/single-channel.yml';

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

// Test class Function
test('Creates Class from parameters', () => {
  expect(testCommon.Class({childrenContent: 'TestChild' , name: 'TestName' , implementsClass: 'TestImplement' , extendsClass: 'TestExtend' })).toBe(`
public class TestName implements TestImplement extends TestExtend{
TestChild
}
`
  );
});

test('Creates Class from parameters without Extend', () => {
  expect(testCommon.Class({childrenContent: 'TestChild' , name: 'TestName' , implementsClass: 'TestImplement'})).toBe(`
public class TestName implements TestImplement {
TestChild
}
`
  );
});

test('Creates Class from parameters without Implements', () => {
  expect(testCommon.Class({childrenContent: 'TestChild' , name: 'TestName'})).toBe(`
public class TestName  {
TestChild
}
`
  );
});

test('Creates Class from only name', () => {
  expect(testCommon.Class({ name: 'TestName'})).toBe(`
public class TestName  {

}
`
  );
});

// Test ClassConstructor function

test('Gets Class Constructor generates from JavaArgs no properties', () => {
  expect(testCommon.ClassConstructor({childrenContent: 'TestChild' , name: 'TestName'})).toBe(`
  public TestName() {
    TestChild
  }`);
});

// Test PackageDeclaration function

test('Generates package java from path', () => {
  expect(testCommon.PackageDeclaration({path: 'test.package'})).toBe(`
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
package test.package;
  `);
});

// Test ImportDeclaration function

test('Generates import java from path', () => {
  expect(testCommon.ImportDeclaration({path: 'test.import'})).toBe(`
import test.import;`);
});

// Test getMqValues function
test('Gets QMGR value from URL', () => {
  expect(testCommon.getMqValues(url, 'qmgr')).toBe('QM1');
});

test('Gets mqChannel value from URL', () => {
  expect(testCommon.getMqValues(url, 'mqChannel')).toBe('DEV.APP.SVRCONN');
});

test('invalid value', () => {
  expect(() => {testCommon.getMqValues(url, 'test');}).toThrow();
});

test('invalid URL', () => {
  expect(() => {testCommon.getMqValues('ibmmq://localhost:1414/QM1', 'qmgr');}).toThrow();
});

test('no URL provided', () => {
  expect(() => {testCommon.getMqValues('', 'test');}).toThrow();
});

test('no value', () => {
  expect(() => {testCommon.getMqValues(url, '');}).toThrow();
});

// Test URLtoHost function

test('Gets Host and Port from URL', () => {
  expect(testCommon.URLtoHost(url)).toBe('localhost:1414');
});

// Test URLtoPort function

test('Gets Port from URL', () => {
  expect(testCommon.URLtoPort(url, '1414')).toBe('1414');
});

test('Gets Port from Default', () => {
  expect(testCommon.URLtoPort('ibmmq://localhost/QM1/DEV.APP.SVRCONN', '1414')).toBe('1414');
});

test('Gets Port from URL overide default', () => {
  expect(testCommon.URLtoPort('ibmmq://localhost:8008/QM1/DEV.APP.SVRCONN', '1414')).toBe('8008');
});

test('invalid port', () => {
  expect(() => {testCommon.URLtoPort('ibmmq://localhost:TEST/QM1/DEV.APP.SVRCONN', '1414');}).toThrow();
});

// Test EnvJson Function

test('EnvJson extracts correct values', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  const OUTPUT_DIR = generateFolderName();

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', yaml));
  
  const generatedJson = JSON.stringify(JSON.parse(testCommon.EnvJson({asyncapi: generator.asyncapi, params: generator.templateParams})));
  const expectedJson = JSON.stringify({
    MQ_ENDPOINTS: [{
      HOST: 'localhost',
      PORT: '1414',
      CHANNEL: 'DEV.APP.SVRCONN',
      QMGR: 'QM1',
      APP_USER: 'app',
      APP_PASSWORD: 'passw0rd'
    }]
  });
  expect(generatedJson).toBe(expectedJson);
});

// Test ImportModels

test('ImportModels are generated', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  const OUTPUT_DIR = generateFolderName();

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', yaml));

  expect(testCommon.ImportModels({asyncapi: generator.asyncapi, params: generator.templateParams})).toStrictEqual([`
import com.ibm.mq.samples.jms.models.Song;`]);
});
