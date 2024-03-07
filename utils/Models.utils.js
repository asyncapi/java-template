import { toJavaClassName } from './String.utils';

export function collateModelNames(asyncapi) {
  return Object.keys(collateModels(asyncapi));
}

export function collateModels(asyncapi) {
  const models = {};

  for (const message of asyncapi.allMessages().all()) {
    const id = message.id() || message.name();
    models[toJavaClassName(id)] = message;
  }

  return models;
}