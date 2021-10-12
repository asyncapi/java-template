import { File, render } from '@asyncapi/generator-react-sdk';

// Import custom components from file 
import {ImportModels, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close, EnvJson} from '../components/Common';




import {Connection } from '../components/Connection';
import {ConnectionHelper} from '../components/ConnectionHelper';
import {LoggingHelper} from '../components/LoggingHelper'
import {DemoSubscriber } from '../components/demo/DemoSubscriber'
import {DemoProducer } from '../components/demo/DemoProducer'

import { Models } from '../components/Files/Models'
import { Producers } from '../components/Files/Producers'
import { Consumers } from '../components/Files/Consumers'
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


  const channels = asyncapi.channels();
  
  // Make folder

  let toRender = {
      producers: Producers(asyncapi, channels, params),
      connectionHelper: ConnectionHelperRenderer(asyncapi),
      models: Models(asyncapi.components().messages()),
      consumers: Consumers(asyncapi, channels, params),
      loggingHelper: LoggingHelperRenderer(asyncapi),
      connectionRender: ConnectionRender(asyncapi),
      demoProducer: ProducerDemoRenderer(asyncapi),
      DemoSubscriber: SubscriberDemoRenderer(asyncapi),
      envJson: EnvJsonRenderer(asyncapi, params)
  }

  // schemas is an instance of the Map
  return Object.entries(toRender).map(([name, renderFunction]) => {
    return renderFunction
  }).flat();
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

function EnvJsonRenderer(asyncapi, params){
  return (
      <File name='/env.json'>
        <EnvJson asyncapi={asyncapi} params={params}></EnvJson>
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

function ProducerGenerators(asyncapi, channels, params){
  return Object.entries(channels).map(([channelName, channel]) => {
    const name = channelName
    const className = toJavaClassName(channelName) + 'Producer'
    console.log("Working for", name)
    
  });
}


function toJavaClassName(name){
  let components = name.split('/')

  return components.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join('');
}