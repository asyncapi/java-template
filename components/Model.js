import { setJavaVars, defineJavaVars } from './Common';

export function ModelConstructor({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    console.log("Message", message)
  
    return(setJavaVars(message.payload().properties()).join(''));
  }

export function ModelClassVariables({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    console.log("Message", message)
  
    let argsString = defineJavaVars(message.payload().properties());
  
    
    console.log("Args", argsString)
  
    return argsString.join(`
    `)
  }
