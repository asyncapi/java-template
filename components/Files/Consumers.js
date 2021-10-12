import { File, render } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close} from '../Common';
import {ProducerConstructor, SendMessage } from '../Producer';
import {ConsumerDeclaration, ConsumerImports, ConsumerConstructor, ReceiveMessage } from '../Consumer';
import { toJavaClassName } from '../../utils/String.utils';


export function Consumers(asyncapi, channels, params){
    return Object.entries(channels).map(([channelName, channel]) => {
      const name = channelName
      const className = toJavaClassName(channelName) + 'Subscriber'
      console.log("Working for", name)
  
      console.log("channel, " ,channel)
  
      // Resolve associated messages this subscriber should support
      // TODO not just import all
      const messages = asyncapi.components().messages();
  
      if(channel.subscribe){
        return (
        
          <File name={`/com/ibm/mq/samples/jms/${className}.java`}>
            <PackageDeclaration path="com.ibm.mq.samples.jms"></PackageDeclaration>
            <ConsumerImports asyncapi={asyncapi}></ConsumerImports>
  
            <ImportModels messages={messages}></ImportModels>
    
            <Class name={className}>
              <ConsumerDeclaration name={channelName} />
    
              <ClassConstructor name={className}>
                <ConsumerConstructor asyncapi={asyncapi} params={params} name={name}/>
              </ClassConstructor>
        
              <ReceiveMessage asyncapi={asyncapi} name={channelName} channel={channel}></ReceiveMessage>
              
              <RecordFaliure></RecordFaliure>
              <ProcessJMSException></ProcessJMSException>
              <Close></Close>
            </Class>
          </File>
    
        );
      }
    });
  }
