import { toJavaClassName } from './String.utils';
import { json } from 'generate-schema';

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


// The rest of the generator depends on a message object
//  having a payload with properties. This is needed to
//  be able to generate Java classes with attributes
//  matching the expected properties.
//
// Some AsyncAPI documents don't include payload properties
//  but provide a sample message instead. For these
//  documents, we can attempt to derive a schema from
//  the sample, and use that schema to generate a usable
//  set of properties.
export function getMessagePayload(message) {
  let payload = message.payload();
  if (!payload) {
    payload = {
      required: () => { return false; }
    };
  }
  if (!payload.properties || !payload.properties()) {
    const generatedProperties = {};

    const examples = message.examples().all();
    if (examples && examples.length > 0) {
      const example = examples[0];
      const examplePayload = example.payload();
      const jsonSchema = json('schema', examplePayload).properties;
      Object.keys(jsonSchema).forEach((propertyName) => {
        generatedProperties[propertyName] = {
          type: () => { return jsonSchema[propertyName].type; },
          format: () => { return; },
          required: () => { return false; }
        };
      });
    }

    payload.properties = () => { return generatedProperties; };
  }
  return payload;
}