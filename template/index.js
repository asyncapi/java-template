import { File, render } from '@asyncapi/generator-react-sdk';

// Import custom components from file 
import { HTML, Head, Body, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor} from '../components/common';
import { ListChannels } from '../components/ListChannels';
import { ImportModels } from '../components/ImportModels';
import { DiagramContent } from '../components/DiagramContent';
import { normalizeSchemaName } from '../helpers/normalizeSchemaName';
import { SendMessage } from '../components/producer/FunctionSendMessage';
import { ConnectionHelper } from '../components/ConnectionHelper';
import { ProducerDeclaration, CreateConnection } from '../components/producer/ProducerDeclaration';
import {ConsumerImports} from '../components/consumer/ConsumerImports'
import {ConsumerDeclaration} from '../components/consumer/ConsumerDeclaration'
import {ConsumerConstructor} from '../components/consumer/ConsumerConstructor'
import {ProducerConstructor} from '../components/producer/ProducerConstructor'
import {LoggingHelper} from '../components/LoggingHelper'
import { ReceiveMessage } from '../components/consumer/FunctionReceiveMessage';
import { Connection } from '../components/Connection';
import {RecordFaliure} from '../components/consumer/FunctionRecordFaliure'
import {ProcessJMSException} from '../components/consumer/FunctionProcessJMSException'
import { ModelClassVariables } from '../components/models/ModelClassVariables';
import {ModelConstructor } from '../components/models/ModelConstructor'
import {DemoSubscriber } from '../components/demo/DemoSubscriber'
import {DemoProducer } from '../components/demo/DemoProducer'
import { Close } from '../components/producer/FunctionClose'
/* 
 * Each template to be rendered must have as a root component a File component,
 * otherwise it will be skipped.
 * 
 * If you don't want to render anything, you can return `null` or `undefined` and then Generator will skip the given template.
 * 
 * Below you can see how reusable chunks (components) could be called.
 * Just write a new component (or import it) and place it inside the File or another component.
 * 
 * Notice that you can pass parameters to components. In fact, underneath, each component is a pure Javascript function.
 */
export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  console.log(params.user)

  const cssLinks = [
    'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css',
    'style.css',
  ];

  const channels = asyncapi.channels();
  
  // Make folder

  let toRender = {
      producerGenerators: ProducerGenerators(asyncapi, channels, params),
      connectionHelper: ConnectionHelperRenderer(asyncapi),
      modelClasses: ModelClasses(asyncapi.components().messages()),
      subscriberGenerators: SubsciberGenerators(asyncapi, channels, params),
      loggingHelper: LoggingHelperRenderer(asyncapi),
      connectionRender: ConnectionRender(asyncapi),
      demoProducer: ProducerDemoRenderer(asyncapi),
      DemoSubscriber: SubscriberDemoRenderer(asyncapi)
  }

  // schemas is an instance of the Map
  return Object.entries(toRender).map(([name, renderFunction]) => {
    return renderFunction
  }).flat();
}


function ModelClasses(messages){
  return Object.entries(messages).map(([messageName, message]) => {
    let messageNameUpperCase = messageName.charAt(0).toUpperCase() + messageName.slice(1);
    
    return (
      <File name={`/com/ibm/mq/samples/jms/models/${messageNameUpperCase}.java`}>
        <PackageDeclaration path={`com.ibm.mq.samples.jms.models`} />
        <ImportDeclaration path={`java.io.Serializable`} />

        
        <Class name={messageNameUpperCase} implementsClass="Serializable">
          {/* Declare local class vars */}
          
          <ModelClassVariables message={message}></ModelClassVariables>

          <ClassConstructor name={messageNameUpperCase} properties={message.payload().properties()}>
            <ModelConstructor message={message}/>
          </ClassConstructor>
        </Class>
      </File>
    )
  });
}

function LoggingHelperRenderer(asyncapi){
  return (
      <File name='/com/ibm/mq/samples/jms/LoggingHelper.java'>
        <LoggingHelper></LoggingHelper>
      </File>
  )
}

function SubscriberDemoRenderer(asyncapi){
  return (
      <File name='/com/ibm/mq/samples/jms/DemoSubscriber.java'>
        <DemoSubscriber></DemoSubscriber>
      </File>
  )
}

function ProducerDemoRenderer(asyncapi){
  return (
      <File name='/com/ibm/mq/samples/jms/DemoProducer.java'>
        <DemoProducer></DemoProducer>
      </File>
  )
}

function ConnectionRender(asyncapi){
  return (
      <File name='/com/ibm/mq/samples/jms/Connection.java'>
        <Connection></Connection>
      </File>
  )
}

function ConnectionHelperRenderer(asyncapi){
  return (
      <File name='/com/ibm/mq/samples/jms/ConnectionHelper.java'>
        <ConnectionHelper></ConnectionHelper>
      </File>
  )
}

function SubsciberGenerators(asyncapi, channels, params){
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

function ProducerGenerators(asyncapi, channels, params){
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

function toJavaClassName(name){
  let components = name.split('/')

  return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
}

function ProducerFile({ asyncapi, channelName, channel}){
  console.log(channelName)
  return (
  <File name={`${channelName}.java`}>
      
      <HeaderContent asyncapi={asyncapi}></HeaderContent>

      <Class name="BasicProducer">
        <ClassHeader/>

        <ClassConstructor>

        </ClassConstructor>

      </Class>
    </File>
  );
}

// function messageSenders({ asyncapi, messageName, message}){
//   const namesList = Object.entries(channels)
//   .map(([channelName, channel]) => {
//     if (
//       (operationType === 'publish' && channel.hasPublish()) || 
//       (operationType === 'subscribe' && channel.hasSubscribe())
//     ) {
//       return  `<li><strong>${channelName}</strong></li>`;
//     }
//   })

//   return namesList
// }

function HeaderContent({ asyncapi }){
  const messages = asyncapi.components().messages();

  return `
${render(<PackageDeclaration path="com.ibm.mq.samples.jms"></PackageDeclaration>)}
${render(<Imports/>)}
${render(<ImportModels messages={messages} />)}
      `
}