import * as MQConsumer from './MQConsumer';
import * as KafkaConsumer from './KafkaConsumer';

const consumerModuleMap = [
  {
    protocols: ['ibmmq', 'ibmmq-secure'],
    module: MQConsumer
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaConsumer
  }
];

function getModule({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const foundModule = consumerModuleMap.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function ConsumerDeclaration({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ConsumerDeclaration();
}
export function ConsumerImports({ asyncapi, params, message }) {
  return getModule({ asyncapi, params }).ConsumerImports({ asyncapi, params, message });
}
export function ReceiveMessage({ asyncapi, params, message }) {
  return getModule({ asyncapi, params }).ReceiveMessage({ message });
}
export function ConsumerClose({ asyncapi, params }) {
  return getModule({ asyncapi, params }).ConsumerClose();
}
export function ConsumerConstructor({ asyncapi, params, name }) {
  return getModule({ asyncapi, params }).ConsumerConstructor({ name });
}
