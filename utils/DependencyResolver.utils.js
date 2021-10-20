const dependencyMap = [
  { 
    protocols: ['ibmmq', 'ibmmq-secure'],
    dependencies: [
      { groupId: 'com.ibm.mq', artifactId: 'com.ibm.mq.allclient', version: '9.2.3.0' }
    ]
  }
];

export function resolveDependencies(protocol) {
  const foundMapping = dependencyMap.find(item => item.protocols.includes(protocol));

  if (!foundMapping) {
    // This will never throw if the protocols in package.json match the dependency map above
    throw new Error(`This template does not currently support the protocol ${protocol}`);
  }

  return foundMapping.dependencies;
}