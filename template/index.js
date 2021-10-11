import { File, render } from '@asyncapi/generator-react-sdk';

// Import custom components from file 

import { Models } from '../components/files/Models'

import { ConnectionHelper } from '../components/ConnectionHelper';

import {LoggingHelper} from '../components/LoggingHelper'
import { Connection } from '../components/Connection';
import {DemoSubscriber } from '../components/demo/DemoSubscriber'
import {DemoProducer } from '../components/demo/DemoProducer'

// Files
import { Subscribers } from '../components/files/Subscribers'
import { Producers } from '../components/files/Producers'
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
      producerGenerators: Producers(asyncapi, channels, params),
      connectionHelper: ConnectionHelperRenderer(asyncapi),
      modelClasses: Models(asyncapi.components().messages()),
      subscriberGenerators: Subscribers(asyncapi, channels, params),
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
