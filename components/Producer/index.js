import * as MQProducer from './MQProducer';
import * as KafkaProducer from './KafkaProducer';

const producerModuleMap = [
  {
    protocols: ['ibmmq', 'ibmmq-secure'],
    module: MQProducer
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaProducer
  }
];

function getModule({ asyncapi, params }) {
  const protocol = asyncapi.server(params.server).protocol();
  const foundModule = producerModuleMap.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function SendMessage({ asyncapi, params }) {
  return getModule({ asyncapi, params }).SendMessage();
}
export function ProducerImports({ asyncapi, params }) {
  const server = asyncapi.server(params.server);
  return getModule({ asyncapi, params }).ProducerImports({ server, params });
}
export function ProducerDeclaration({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ProducerDeclaration();
}
export function ProducerClose({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ProducerClose();
}
export function ProducerConstructor({ asyncapi, params, name }) {
  return getModule({ asyncapi, params }).ProducerConstructor({ name });
}
