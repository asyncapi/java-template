import { ConnectionHelper as KafkaConnectionHelper } from './KafkaConnectionHelper';
import { ConnectionHelper as MQConnectionHelper } from './MQConnectionHelper';

const connectionModuleMap = [
  {
    protocols: ['ibmmq', 'ibmmq-secure'],
    module: MQConnectionHelper
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    module: KafkaConnectionHelper
  }
];

export default function({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const foundModule = connectionModuleMap.find(item => item.protocols.includes(protocol));
  if (!foundModule) {
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }
  return foundModule.module({ asyncapi, params });
}
