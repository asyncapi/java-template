const testProducer = require('../components/Producer');

const path = require('path');
const Generator = require('@asyncapi/generator');
const crypto = require('crypto');

const MAIN_TEST_RESULT_PATH = path.join('test', 'temp', 'integrationTestResult');

test('Generates Coonnection for publisher ', async () => {
  const generateFolderName = () => {
    return path.resolve(MAIN_TEST_RESULT_PATH, crypto.randomBytes(4).toString('hex'));
  };
    
  jest.setTimeout(30000);
    
  const OUTPUT_DIR = generateFolderName();

  const params = {
    server: 'production1'
  };
    
  const generator = new Generator(path.normalize('./'), OUTPUT_DIR, { forceWrite: true, templateParams: params });
  await generator.generateFromFile(path.resolve('test', 'mocks/single-channel.yml'));

  expect(testProducer.ProducerConstructor({name: 'single/released'})).toBe(`
    super();
    String id = null;
    id = "Basic pub";

    logger.info("Sub application is starting");

    this.createConnection("single/released", id);

        // Set so no JMS headers are sent.
        ch.setTargetClient(destination);
        producer = context.createProducer();
`
  );
});