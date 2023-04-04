const dependencyMap = [{
    protocols: ['ibmmq', 'ibmmq-secure'],
    api: {
      "jms": {
        base: "javax.jms",
        imports: [
          "com.ibm.msg.client.jms.JmsConnectionFactory",
          "com.ibm.msg.client.jms.JmsFactoryFactory",
          "com.ibm.msg.client.wmq.WMQConstants",
          "com.ibm.mq.jms.MQDestination"
        ],
        dependencies: [{
            groupId: 'com.ibm.mq',
            artifactId: 'com.ibm.mq.allclient',
            version: '9.3.2.0'
          },
          {
            groupId: 'javax.jms',
            artifactId: 'javax.jms-api',
            version: '2.0.1'
          }
        ]
      },
      "jakarta": {
        base: "jakarta.jms",
        imports: [
          "com.ibm.msg.client.jakarta.jms.JmsConnectionFactory",
          "com.ibm.msg.client.jakarta.jms.JmsFactoryFactory",
          "com.ibm.msg.client.jakarta.wmq.WMQConstants",
          "com.ibm.mq.jakarta.jms.MQDestination"
        ],
        dependencies: [{
            groupId: 'com.ibm.mq',
            artifactId: 'com.ibm.mq.jakarta.client',
            version: '9.3.2.0'
          },
          {
            groupId: 'jakarta.jms',
            artifactId: 'jakarta.jms-api',
            version: '3.1.0'
          }
        ]
      }
    }
  },
  {
    protocols: ['kafka', 'kafka-secure'],
    dependencies: [{
      groupId: 'org.apache.kafka',
      artifactId: 'kafka-clients',
      version: '2.8.0'
    }]
  }
];

function resolveDependencies(protocol, chosenMessagingApi) {
  const foundMapping = dependencyMap.find(item => item.protocols.includes(protocol));

  if (!foundMapping) {
    // This will never throw if the protocols in package.json match the dependency map above
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }

  // Kafka doesnt require JMS/Jakarta so support a static list of deps
  if (foundMapping.dependencies) {
    return foundMapping.dependencies;
  }

  return foundMapping.api[chosenMessagingApi].dependencies;
}

function getApi(protocol, chosenMessagingApi) {
  const foundMapping = dependencyMap.find(item => item.protocols.includes(protocol));
  return foundMapping.api[chosenMessagingApi];
}

export {
  resolveDependencies,
  getApi
};
