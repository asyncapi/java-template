const typesUtils = require('../utils/Types.utils');

const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

// Test class asyncApiToJavaType
test('Check integer type is converted to int', () => {
  expect(typesUtils.asyncApiToJavaType('integer')).toBe('int');
});
test('Check int64 type is converted to long', () => {
  expect(typesUtils.asyncApiToJavaType('integer', 'int64')).toBe('long');
});

test('Check string type is converted to String', () => {
  expect(typesUtils.asyncApiToJavaType('string')).toBe('String');
});

test('Check password format is converted to String', () => {
  expect(typesUtils.asyncApiToJavaType('string', 'password')).toBe('String');
});

test('Check uuid format is converted to UUID', () => {
  expect(typesUtils.asyncApiToJavaType('string', 'uuid')).toBe('UUID');
});

test('Check byte type is not changed', () => {
  expect(typesUtils.asyncApiToJavaType('string', 'byte')).toBe('byte');
});

test('Unexpected type throws error', () => {
  expect(() => { typesUtils.asyncApiToJavaType('test');}).toThrow();
});

// Test class setLocalVariables
test('Check local variables is changed', () => {
  const properties = {name: 'name' , property: 'property'};
  expect(typesUtils.setLocalVariables(properties)).toStrictEqual([`
    this.name = name;
    `,
  `
    this.property = property;
    `,
  ]);
});

test('Define Variables For Properties', async () => {
  jest.setTimeout(30000);

  const OUTPUT_DIR = path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));

  const params = {
    server: 'production'
  };

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

  const payload = generator.asyncapi.allMessages().get('song').payload();
  const properties = generator.asyncapi.allMessages().get('song').payload().properties();

  // Test class defineVariablesForProperties
  expect(typesUtils.defineVariablesForProperties(payload)).toStrictEqual(['public String title;', 'public String artist;', 'public String album;', 'public String genre;', 'public int length;'],);

  // Test class passJavaArgs
  expect(typesUtils.passJavaArgs(properties)).toStrictEqual('title,artist,album,genre,length');
  // Test class createJavaArgsFromProperties
  expect(typesUtils.createJavaArgsFromProperties(properties)).toStrictEqual(['String title', 'String artist', 'String album', 'String genre', 'int length']);
});

// Test function asyncApiTypeToDemoValue
test('Check integer type is a random number', () => {
  expect(typesUtils.asyncApiToDemoValue('integer')).toEqual(expect.any(Number));
});

test('Unexpected type throws an error', () => {
  expect(() => { typesUtils.asyncApiToDemoValue('test');}).toThrow();
});
