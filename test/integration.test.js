const path = require('path');
const Generator = require('@asyncapi/generator');
const { existsSync } = require('fs');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

/* 
 * Please note: This test file was adapted from 
 * https://github.com/asyncapi/java-spring-cloud-stream-template/blob/master/test/integration.test.js
 */

describe('template integration tests using the generator', () => {
  const generateFolderName = () => {
    // You always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  it('should generate static application files', async () => {
    jest.setTimeout(30000);
  
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.ibm.mq.samples.jms';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production'
    };
  
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const index in expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, expectedFiles[index]))).toBe(true);
    }
  });

  it('should generate dynamic producer subscriber files', async () => {
    jest.setTimeout(30000);
  
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.ibm.mq.samples.jms';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production'
    };
  
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

    const channelName = 'SingleReleased';

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/${channelName}Producer.java`,
      `${PACKAGE_PATH}/${channelName}Subscriber.java`
    ];
    
    for (const index in expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, expectedFiles[index]))).toBe(true);
    }
  });

  it('should generate dynamic model files', async () => {
    jest.setTimeout(30000);
  
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.ibm.mq.samples.jms';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production'
    };
  
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/many-messages.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/models/Single.java`,
      `${PACKAGE_PATH}/models/Album.java`,
      `${PACKAGE_PATH}/models/Artist.java`
    ];
    
    for (const index in expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, expectedFiles[index]))).toBe(true);
    }
  });

  it('file structure should depend on package', async () => {
    jest.setTimeout(30000);
  
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.ibm.mq.different.jms';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production',
      package: PACKAGE
    };
  
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/many-messages.yml'));

    const expectedFiles = [
      `${PACKAGE_PATH}/Connection.java`
    ];
    
    for (const index in expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, expectedFiles[index]))).toBe(true);
    }
  });
});
