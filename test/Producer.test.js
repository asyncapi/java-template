const testProducer = require('../components/Producer');

const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

test('Generates Connection for publisher', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
    
  jest.setTimeout(30000);
    
  const OUTPUT_DIR = generateFolderName();

  const params = {
    server: 'production'
  };
    
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

  expect(testProducer.ProducerConstructor({asyncapi: generator.asyncapi, params: generator.templateParams, name: 'song/released'})).toBe(`
    super();
    String id = null;
    id = "Basic pub";

    logger.info("Pub application is starting");

    // Establish connection for producer
    this.createConnection("song/released", id);

    // Set so no JMS headers are sent.
    ch.setTargetClient(destination);
    producer = context.createProducer();
`
  );
});

// Test producer Imports function
test('Generates all imports from path', async() => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };

  jest.setTimeout(30000);

  const OUTPUT_DIR = generateFolderName();

  const params = {
    server: 'production'
  };

  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

  expect(testProducer.ProducerImports({asyncapi: generator.asyncapi, params: generator.templateParams})).toBe(`
import java.util.logging.*;
import java.io.Serializable;

import javax.jms.Destination;
import javax.jms.JMSProducer;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.JMSRuntimeException;
import javax.jms.ObjectMessage;


import com.asyncapi.ConnectionHelper;
import com.asyncapi.LoggingHelper;
import com.asyncapi.Connection;
import com.asyncapi.PubSubBase;
import com.asyncapi.models.ModelContract;

import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;
  `);
});
