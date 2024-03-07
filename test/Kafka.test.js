const path = require('path');
const Generator = require('@asyncapi/generator');
const { existsSync, readFileSync } = require('fs');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');


describe('kafka integration tests using the generator', () => {

  const generateFolderName = () => {
    // You always want to generate to new directory to make sure test runs in clear environment
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  it('should generate Java for a secured, encrypted Kafka', async () => {
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.asyncapi';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production'
    };
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-example.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoProducer.java`,
      `${PACKAGE_PATH}/DemoSubscriber.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/SongReleasedProducer.java`,
      `${PACKAGE_PATH}/SongReleasedSubscriber.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/Song.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }

    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"SASL_SSL\")")).toBe(true);
    expect(connectionHelper.includes("props.put(\"sasl.mechanism\", \"SCRAM-SHA-512\")")).toBe(true);
  });


  it('should generate Java for an encrypted Kafka', async () => {
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.custom.package';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production',
      package: PACKAGE
    };
    console.log(OUTPUT_DIR);
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-example-encrypt.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoProducer.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/SongReleasedProducer.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/Song.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }

    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"SSL\")")).toBe(true);
  });


  it('should generate Java for a plain Kafka', async () => {
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'asyncapi.kafka';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production',
      package: PACKAGE
    };
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-example-plain.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoProducer.java`,
      `${PACKAGE_PATH}/DemoSubscriber.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/SongReleasedProducer.java`,
      `${PACKAGE_PATH}/SongReleasedSubscriber.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/Song.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }

    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"PLAINTEXT\")")).toBe(true);
  });


  it('should generate Java for a secured Kafka', async () => {
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'asyncapi.kafka';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'production',
      package: PACKAGE
    };
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-example-auth.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoSubscriber.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/SongReleasedSubscriber.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/Song.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }
    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"SASL_PLAINTEXT\")")).toBe(true);
    expect(connectionHelper.includes("props.put(\"sasl.mechanism\", \"PLAIN\")")).toBe(true);
  });


  it('should generate Java for the streetlights example', async () => {
    const OUTPUT_DIR = generateFolderName();
    const PACKAGE = 'com.asyncapi.examples.streetlights.v2';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'mtls-connections',
      package: PACKAGE
    };
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-streetlights-v2.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoSubscriber.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/SmartylightingStreetlights10ActionStreetlightIdDimProducer.java`,
      `${PACKAGE_PATH}/SmartylightingStreetlights10ActionStreetlightIdTurnOffProducer.java`,
      `${PACKAGE_PATH}/SmartylightingStreetlights10ActionStreetlightIdTurnOnProducer.java`,
      `${PACKAGE_PATH}/SmartylightingStreetlights10EventStreetlightIdLightingMeasuredSubscriber.java`,
      `${PACKAGE_PATH}/models/DimLight.java`,
      `${PACKAGE_PATH}/models/LightMeasured.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/TurnOnOff.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }
    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"SSL\")")).toBe(true);
  });


  it('should generate Java for a v3 AsyncAPI', async () => {
    const OUTPUT_DIR = generateFolderName();
    console.log(OUTPUT_DIR);
    const PACKAGE = 'com.asyncapi.examples.streetlights.v3';
    const PACKAGE_PATH = path.join(...PACKAGE.split('.'));
    const params = {
      server: 'scram-connections',
      package: PACKAGE
    };
    const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
    await generator.generateFromFile(path.resolve('test', 'mocks/kafka-streetlights-v3.yml'));

    const expectedFiles = [
      'pom.xml',
      `${PACKAGE_PATH}/Connection.java`,
      `${PACKAGE_PATH}/ConnectionHelper.java`,
      `${PACKAGE_PATH}/LoggingHelper.java`,
      `${PACKAGE_PATH}/DemoSubscriber.java`,
      `${PACKAGE_PATH}/PubSubBase.java`,
      `${PACKAGE_PATH}/LightingMeasuredSubscriber.java`,
      `${PACKAGE_PATH}/LightsDimProducer.java`,
      `${PACKAGE_PATH}/LightTurnOffProducer.java`,
      `${PACKAGE_PATH}/LightTurnOnProducer.java`,
      `${PACKAGE_PATH}/models/DimLight.java`,
      `${PACKAGE_PATH}/models/LightMeasured.java`,
      `${PACKAGE_PATH}/models/ModelContract.java`,
      `${PACKAGE_PATH}/models/TurnOn.java`,
      'Dockerfile',
      'env.json'
    ];

    for (const file of expectedFiles) {
      expect(existsSync(path.join(OUTPUT_DIR, file))).toBe(true);
    }
    const connectionHelper = readFileSync(path.join(OUTPUT_DIR, `${PACKAGE_PATH}/ConnectionHelper.java`), 'utf-8');
    expect(connectionHelper.includes("props.put(\"security.protocol\", \"SASL_SSL\")")).toBe(true);
    expect(connectionHelper.includes("props.put(\"sasl.mechanism\", \"SCRAM-SHA-256\")")).toBe(true);
  });

});