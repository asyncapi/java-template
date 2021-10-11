import { File, render } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close} from '../Common';
import {ModelClassVariables, ModelConstructor } from '../Model';
import {ProducerConstructor, SendMessage } from '../Producer';

export function Producers(asyncapi, channels, params){
    return Object.entries(channels).map(([channelName, channel]) => {
      const name = channelName
      const className = toJavaClassName(channelName) + 'Producer'
      console.log("Working for", name)
      
  
  
      if(channel.publish){
        return (
        
          <File name={`/com/ibm/mq/samples/jms/${className}.java`}>
            
            <HeaderContent asyncapi={asyncapi}></HeaderContent>
    
            <Class name={className}>
              <ClassHeader/>
    
              <ClassConstructor name={className}>
                  <ProducerConstructor asyncapi={asyncapi} params={params} name={name}/>
                
              </ClassConstructor>
              
              <SendMessage asyncapi={asyncapi} name={channelName} channel={channel}></SendMessage>
              <Close></Close>
              
            </Class>
          </File>
    
        );
      }
    });
  }
  
  function toJavaClassName(name){
    let components = name.split('/')
  
    return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
  }
  
  function HeaderContent({ asyncapi }){
    const messages = asyncapi.components().messages();
  
    return `
  ${render(<PackageDeclaration path="com.ibm.mq.samples.jms"></PackageDeclaration>)}
  ${render(<Imports/>)}
  ${render(<ImportModels messages={messages} />)}
        `
  }