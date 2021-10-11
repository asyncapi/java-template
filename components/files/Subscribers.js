/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';
import { File } from '@asyncapi/generator-react-sdk';
import { PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor} from '../common';
import { ConsumerImports } from '../consumer/ConsumerImports'
import { ImportModels } from '../ImportModels';
import { ConsumerDeclaration } from '../consumer/ConsumerDeclaration'
import { ConsumerConstructor } from '../consumer/ConsumerConstructor'
import { ReceiveMessage } from '../consumer/FunctionReceiveMessage';
import { RecordFaliure } from '../consumer/FunctionRecordFaliure'
import { ProcessJMSException } from '../consumer/FunctionProcessJMSException'
import { Close } from '../producer/FunctionClose'

function toJavaClassName(name){
  let components = name.split('/')

  return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
}

export function Subscribers(asyncapi, channels, params){
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
              <ConsumerConstructor asyncapi={asyncapi} params={params} name={className}/>
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




