import { File, render } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close} from '../Common';
import {ProducerConstructor, SendMessage } from '../Producer';
import { toJavaClassName } from '../../utils/String.utils';

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
  
  
  function HeaderContent({ asyncapi }){
    const messages = asyncapi.components().messages();
  
    return `
  ${render(<PackageDeclaration path="com.ibm.mq.samples.jms"></PackageDeclaration>)}
  ${render(<Imports/>)}
  ${render(<ImportModels messages={messages} />)}
        `
  }