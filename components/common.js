/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */
import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';

/*
  * Each component has a `childrenContent` property.
  * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
  * 
  * Example:
  * function CustomComponent({ childrenContent }) {
  *   return `some text at the beginning: ${childrenContent}`
  * }
  * 
  * function RootComponent() {
  *   return (
  *     <CustomComponent>
  *       some text at the end.
  *     </CustomComponent>
  *   );
  * }
  * 
  * then output from RootComponent will be `some text at the beginning: some text at the end.`.
  */

export function Class({ childrenContent, name, implementsClass }) {
  let implementsString = "";

  if(implementsClass != null){
    implementsString = `implements ${implementsClass}`
  }
  return `
public class ${name} ${implementsString}{
  ${childrenContent}
}
`;
}

export function ClassHeader({ }) {
return `
  private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");

  public static final String PRODUCER_PUT = "queue";
  public static final String PRODUCER_PUB = "topic";

  private JMSContext context = null;
  private Destination destination = null;
  private JMSProducer producer = null;
  private ConnectionHelper ch = null;`
}

function createJavaArgs(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `${toJavaType(property.type())} ${name}`
  })
}

function passJavaArgs(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `${name}`
  })
}

function defineJavaVars(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `public ${toJavaType(property.type())} ${name};`
  })
}

function setJavaVars(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `
  this.${name} = ${name};
`
  })
}



function toJavaType(asyncApiType) {
  switch (asyncApiType){
    
    case "integer":
      return "int"

    case "long":
      return "Long"

    case "float":
      return "float"

    case "double":
      return "double"

    case "string":
      return "String"
      
    case "byte":
      return "byte"
  
    case "binary":
      return "String"

    case "boolean":
      return "boolean"

    case "date":
      return "String"

    case "dateTime":
      return "String"

    case "password":
      return "String"
  }
}

export function ClassConstructor({ childrenContent, name, properties }) {
  let propertiesString = `String type`;
  

  console.log(`Constructing ${name}, properties`, properties)
  if(properties){
    propertiesString = createJavaArgs(properties);

  }

  return `
  public ${name}(${propertiesString}) {
    ${childrenContent}
  }`
}

export function PackageDeclaration({ path }) {
  return `
package ${path};
  `
}

export function ImportDeclaration({ path }) {
  return `
import ${path};`
}

export function Imports() {
  return `
import java.util.logging.*;
import java.io.Serializable;

import javax.jms.Destination;
import javax.jms.JMSProducer;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.JMSRuntimeException;
import javax.jms.ObjectMessage;


import com.ibm.mq.samples.jms.ConnectionHelper;
import com.ibm.mq.samples.jms.LoggingHelper;
import com.ibm.mq.samples.jms.Connection;

import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;

  `
}

export function ImportModels({ messages }) {
  const namesList = Object.entries(messages)
    .map(([messageName, message]) => {
      return `import com.ibm.mq.samples.jms.models.${messageName.charAt(0).toUpperCase() + messageName.slice(1)};`
    });

  return namesList;
}

// Send Message

export function SendMessage({ asyncApi, channel }) {
  // TODO one of can be used in message apparently?
  let properties = channel.subscribe().message().payload().properties();

  let args = createJavaArgs(properties);

  let message = channel.subscribe().message();
  
  console.log("name", channel.subscribe().message())

  //TODO remove hardcode
  
  return `
  public void sendSingle(${args.join(', ')}) {
      // First create instance of model
      Serializable single = new Single(
          ${passJavaArgs(properties)}
      );

      try{
          ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
          String json = ow.writeValueAsString(single);
  
          System.out.println(json);

          this.producer.send(destination, json);
          
      }catch (JsonProcessingException e){
          System.out.println(e);
      }
  }`
}

function getMqValues(url, val) {
  var reg = new RegExp("(?<=ibmmq://.*/).*/.*", "gm");
  const splitVals = reg.exec(url).toString().split("/");
  if (val == 'qmgr')
      return splitVals[0];
  if (val == 'mqChannel')
      return splitVals[1];
    
  }
  
function URLtoHost(url) {
    const u = new URL(url);
    return u.host;
  }
function URLtoPort(url, defaultPort) {
    const u = new URL(url);
    return u.port || defaultPort;
  }


export function ConsumerConstructor({asyncapi, name, params}) {
  const url = asyncapi.server('production1').url() 
  let qmgr = getMqValues(url,'qmgr')
  let mqChannel = getMqValues(url,'mqChannel')
  let host = URLtoHost(url)
  let domain = host.split(':', 1)
  return `
    String id = null;

    switch(type){
        case CONSUMER_SUB :
            id = "Basic sub";
            break;
        case CONSUMER_GET :
            id = "Basic Get";
            break;
    }

    LoggingHelper.init(logger);
    logger.info("Sub application is starting");

    Connection myConnection = new Connection(
      "${domain}",
      ${ URLtoPort(url, 1414) },
      "${mqChannel}",
      "${qmgr}",
      "${params.user}",
      "${params.password}",
      "single/released",
      "single/released",
      null);

    ch = new ConnectionHelper(id, myConnection);

    logger.info("created connection factory");

    context = ch.getContext();
    logger.info("context created");

    switch(type){
        case CONSUMER_SUB :
            destination = ch.getTopicDestination();
            break;
        case CONSUMER_GET :
            destination = ch.getDestination();
            break;
    }

    logger.info("destination created");
`
}

export function ProducerConstructor({asyncapi, name, params}) {
  const url = asyncapi.server('production1').url() 
  let qmgr = getMqValues(url,'qmgr')
  let mqChannel = getMqValues(url,'mqChannel')
  let host = URLtoHost(url)
  let domain = host.split(':', 1)

  return `
    String id = null;

    switch(type){
        case PRODUCER_PUT :
            id = "Basic put";
            break;
        case PRODUCER_PUB :
            id = "Basic pub";
            break;
    }

    LoggingHelper.init(logger);
    logger.info("Sub application is starting");


    Connection myConnection = new Connection(
      "${domain}",
      ${ URLtoPort(url, 1414) },
      "${mqChannel}",
      "${qmgr}",
      "${params.user}",
      "${params.password}",
      "single/released",
      "single/released",
      null);

      ch = new ConnectionHelper(id, myConnection);
      logger.info("created connection factory");

  

      context = ch.getContext();
      logger.info("context created");

      switch(type){
          case PRODUCER_PUB :
              destination = ch.getTopicDestination();
              break;
          case PRODUCER_PUT :
              destination = ch.getDestination();
              break;
      }

      // Set so no JMS headers are sent.
      ch.setTargetClient(destination);

      logger.info("destination created");

      producer = context.createProducer();
`
}

export function ReceiveMessage({ asyncApi, channel }) {
  // TODO one of can be used in message apparently?
  let properties = channel.subscribe().message().payload().properties();

  let args = createJavaArgs(properties);

  let message = channel.subscribe().message();
  
  console.log("name", channel.subscribe().message())

  //TODO remove hardcode
  
  return `
  public void receive(int requestTimeout) {
    boolean continueProcessing = true;

    consumer = context.createConsumer(destination);
    logger.info("consumer created");

    while (continueProcessing) {
        try {
            Message receivedMessage = consumer.receive(requestTimeout);
            if (receivedMessage == null) {
                logger.info("No message received from this endpoint");
              //    continueProcessing = false;       THIS IS COMMENTED FOR TESTING PURPOSES, UNCOMMENT WHEN DONE
            } else {
              if (receivedMessage instanceof TextMessage) {
                  TextMessage textMessage = (TextMessage) receivedMessage;
                  try {
                      logger.info("Received message: " + textMessage.getText());
                      Single receivedSingleObject = new ObjectMapper().readValue(textMessage.getText(), Single.class); // HARDCODED, REACTIFY

                      System.out.println("TYPE: " + receivedSingleObject.getClass().getName()); // REMOVE THIS EVENTUALLY BUT GOOD FOR DEMO
                      System.out.println(receivedSingleObject.toString()); // REMOVE EITHER THIS OR logger.info(Received...

                  } catch (JMSException jmsex) {
                      recordFailure(jmsex);
                  } catch (JsonProcessingException jsonproex) {
                      recordFailure(jsonproex);
                  }
              } else if (receivedMessage instanceof Message) {
                  logger.info("Message received was not of type TextMessage.");
              } else {
                  logger.info("Received object not of JMS Message type!");
              }
            }
        } catch (JMSRuntimeException jmsex) {
            jmsex.printStackTrace();
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
            }
        }
     }
  }
`
}

export function RecordFaliure({ asyncApi }) {
  
  //TODO remove hardcode
  
  return `
  private void recordFailure(Exception ex) {
    if (ex != null) {
        if (ex instanceof JMSException) {
            processJMSException((JMSException) ex);
        } else {
            logger.warning(ex.getMessage());
        }
    }
    logger.info("FAILURE");
    return;
  }
`
}

export function ProcessJMSException({ asyncApi }) {
  
  //TODO remove hardcode
  
  return `
  private void processJMSException(JMSException jmsex) {
    logger.warning(jmsex.getMessage());
    Throwable innerException = jmsex.getLinkedException();
    logger.warning("Exception is: " + jmsex);
    if (innerException != null) {
        logger.warning("Inner exception(s):");
    }
    while (innerException != null) {
        logger.warning(innerException.getMessage());
        innerException = innerException.getCause();
    }
    return;
}
`
}

export function ModelClassVariables({ asyncApi, message }) {
  // TODO one of can be used in message apparently?
  console.log("Message", message)

  let argsString = defineJavaVars(message.payload().properties());

  
  console.log("Args", argsString)

  return argsString.join(`
  `)
}

export function ModelConstructor({ asyncApi, message }) {
  // TODO one of can be used in message apparently?
  console.log("Message", message)

  return(setJavaVars(message.payload().properties()).join(''));
}

export function Close({ asyncApi, channel }) {
  // TODO one of can be used in message apparently?
  return `
public void close() {
    ch.closeContext();
    ch = null;
}`
}




