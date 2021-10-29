import { toJavaClassName } from './String.utils';

export function collateModelNames(asyncapi) {
  return Object.keys(collateModels(asyncapi));
}

export function collateModels(asyncapi) {
  const models = {};

  for (const channel of Object.values(asyncapi.channels())) {
    if (channel.publish()) {
      for (const  message of Object.values(channel.publish().messages())) {
        models[toJavaClassName(message.uid())] = message;
      }
    }
    if (channel.subscribe()) {
      for (const message of Object.values(channel.subscribe().messages())) {
        models[toJavaClassName(message.uid())] = message;
      }
    }
  }

  // Components may exist which are not used anywhere, still include them here

  if (asyncapi.components() && asyncapi.components().messages()) {
    for (const message of Object.values(asyncapi.components().messages())) {
      models[toJavaClassName(message.uid())] = message;
    }
  }

  return models;
}