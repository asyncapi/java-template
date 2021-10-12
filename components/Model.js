import { setLocalVariables, defineVariablesForProperties } from '../utils/Types.utils';

export function ModelConstructor({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    console.log("Message", message)
  
    return(setLocalVariables(message.payload().properties()).join(''));
  }

export function ModelClassVariables({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    console.log("Message", message)
  
    let argsString = defineVariablesForProperties(message.payload().properties());
  
    
    console.log("Args", argsString)
  
    return argsString.join(`
    `)
  }

  