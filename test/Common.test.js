const testCommon = require('../components/Common');

const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const url = 'ibmmq://localhost:1414/QM1/DEV.APP.SVRCONN';
const params = {
  server: 'production1'
};

const yaml = 'mocks/single-channel.yml';

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

//Test class Function
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

// test('Do not create class if name is not defined ', () => {
//   expect(testCommon.Class()).toBe(`Invalid parameters passed into class function, name is required`
//      );
// });

//Test ClassConstructor function

test('Gets Class Constructor generates from JavaArgs no properties', () => {
  expect(testCommon.ClassConstructor({childrenContent: 'TestChild' , name: 'TestName'})).toBe(`
  public TestName() {
    TestChild
  }`);
});

// test('Gets Class Constructor generates from JavaArgs with properties', () => {
//   expect(testCommon.ClassConstructor({childrenContent : "TestChild" , name : "TestName", properties : })).toBe(`
//   public TestName() {
//     TestChild
//   }`);
// });

//Test PackageDeclaration function

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

//Test ImportDeclaration function

test('Generates import java from path', () => {
  expect(testCommon.ImportDeclaration({path: 'test.import'})).toBe(`
import test.import;`);
});

//Test getMqValues function
test('Gets QMGR value from URL', () => {
  expect(testCommon.getMqValues(url, 'qmgr')).toBe('QM1');
});
test('Gets mqChannel value from URL', () => {
  expect(testCommon.getMqValues(url, 'mqChannel')).toBe('DEV.APP.SVRCONN');
});
test('Test invalid value', () => {
  expect(testCommon.getMqValues(url, 'test')).toBe('Invalid parameter passed into getMqValues function');
});
test('Test invalid URL', () => {
  expect(testCommon.getMqValues('ibmmq://localhost:1414/QM1', 'qmgr')).toBe('Invalid URL passed into getMqValues function');
});
test('Test no URL provided', () => {
  expect(testCommon.getMqValues('', 'test')).toBe('Invalid URL passed into getMqValues function');
});
test('Test no value', () => {
  expect(testCommon.getMqValues(url, '')).toBe('Invalid parameter passed into getMqValues function');
});

//Test URLtoHost function

test('Gets Host and Port from URL', () => {
  expect(testCommon.URLtoHost(url)).toBe('localhost:1414');
});

//Test URLtoPort function

test('Gets Port from URL', () => {
  expect(testCommon.URLtoPort(url, '1414')).toBe('1414');
});
test('Gets Port from Default', () => {
  expect(testCommon.URLtoPort('ibmmq://localhost/QM1/DEV.APP.SVRCONN', '1414')).toBe('1414');
});
test('Gets Port from URL overide default', () => {
  expect(testCommon.URLtoPort('ibmmq://localhost:8008/QM1/DEV.APP.SVRCONN', '1414')).toBe('8008');
});

//Test EnvJson Function

test('Test EnvJson extracts correct values', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  const OUTPUT_DIR = generateFolderName();

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', yaml));
  
  expect(testCommon.EnvJson({asyncapi: generator.asyncapi, params: generator.templateParams})).toBe(`
  {
    "MQ_ENDPOINTS": [{
      "HOST": "localhost",
      "PORT": "1414",
      "CHANNEL": "DEV.APP.SVRCONN",
      "QMGR": "QM1",
      "APP_USER": "app",
      "APP_PASSWORD": "passw0rd"
    }]
  }
  `);
});

//Test ImportModels

test('Test ImportModels are generated', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  const OUTPUT_DIR = generateFolderName();

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', yaml));

  expect(testCommon.ImportModels({messages: generator.asyncapi.components().messages(), params: generator.templateParams})).toStrictEqual(['import com.ibm.mq.samples.jms.models.Single;']);
});
