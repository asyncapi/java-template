
import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';
import { File, render } from '@asyncapi/generator-react-sdk';
import { PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor} from '../common';
import { ProducerConstructor } from '../producer/ProducerConstructor'
import { SendMessage } from '../producer/FunctionSendMessage';
import { ImportModels } from '../ImportModels';
import { Close } from '../producer/FunctionClose'

function HeaderContent({ asyncapi }){
    const messages = asyncapi.components().messages();
  
    return `
  ${render(<PackageDeclaration path="com.ibm.mq.samples.jms"></PackageDeclaration>)}
  ${render(<Imports/>)}
  ${render(<ImportModels messages={messages} />)}
        `
  }

function toJavaClassName(name){
    let components = name.split('/')
  
    return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
}

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
                  <ProducerConstructor asyncapi={asyncapi} params={params} name={className}/>
                
              </ClassConstructor>
              
              <SendMessage asyncapi={asyncapi} name={channelName} channel={channel}></SendMessage>
              <Close></Close>
              
            </Class>
          </File>
    
        );
      }
    });
  }
  