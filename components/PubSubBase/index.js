import * as MQPubSubBase from './MQPubSubBase';
import * as KafkaPubSubBase from './KafkaPubSubBase';

const pubSubModuleMap = [
  {
    protocols: ['ibmmq', 'ibmmq-secure'],
    module: MQPubSubBase
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaPubSubBase
  }
];

function getModule({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const foundModule = pubSubModuleMap.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module;
}

export function PubSubBase(asyncapi, params) {
  return getModule({ asyncapi, params }).PubSubBase(params);
}
