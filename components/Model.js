import { setLocalVariables, defineVariablesForProperties } from '../utils/Types.utils';

export function ModelConstructor({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    return(setLocalVariables(message.payload().properties()).join(''));
  }

export function ModelClassVariables({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    let argsString = defineVariablesForProperties(message.payload().properties());
  
    return argsString.join(`
    `)
  }

  