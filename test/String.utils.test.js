const stringUtils = require('../utils/String.utils');

// Test class toJavaClassName
test('Check string is capitalised', () => {
  expect(stringUtils.toJavaClassName('test')).toBe('Test'
  );
});

test('Check string slashes are replaced', () => {
  expect(stringUtils.toJavaClassName('test/test')).toBe('TestTest'
  );
});

test('Check other no letter chars are replaced', () => {
  expect(stringUtils.toJavaClassName('test@test.test;test*test')).toBe('TestTestTestTestTest'
  );
});

// Test class javaPackageToPath

test('Check adds / to start and end', () => {
  expect(stringUtils.javaPackageToPath('test')).toBe('/test/'
  );
});

test('Check string changes . to /', () => {
  expect(stringUtils.javaPackageToPath('test.test')).toBe('/test/test/'
  );
});