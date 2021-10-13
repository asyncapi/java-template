import { getMqValues, URLtoHost, URLtoPort } from './Common';
import { createJavaArgsFromProperties } from '../utils/Types.utils'


export function ConsumerDeclaration({name}) {
    return `
      private JMSConsumer consumer = null;
    `
    }
     

export function ConsumerImports({ asyncApi, messageNames, params }) {
return `
    import java.util.logging.*;
    import java.io.Serializable;
    
    import javax.jms.Destination;
    import javax.jms.JMSConsumer;
    import javax.jms.JMSContext;
    import javax.jms.Message;
    import javax.jms.TextMessage;
    import javax.jms.JMSRuntimeException;
    import javax.jms.JMSException;
    
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.ObjectWriter; 
    import com.fasterxml.jackson.core.JsonProcessingException;
    import com.fasterxml.jackson.annotation.JsonView;
    
    
    import ${params.package}.ConnectionHelper;
    import ${params.package}.LoggingHelper;
    import ${params.package}.Connection;
    import ${params.package}.PubSubBase;
    import ${params.package}.models.ModelContract;
        
    `
}

export function ReceiveMessage({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?

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
                        ModelContract receivedSingleObject = new ObjectMapper().readValue(textMessage.getText(), ModelContract.class); // HARDCODED, REACTIFY
  
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
  
  export function ConsumerConstructor({asyncapi, name, params}) {
    const url = asyncapi.server('production1').url() 
    let qmgr = getMqValues(url,'qmgr')
    let mqChannel = getMqValues(url,'mqChannel')
    let host = URLtoHost(url)
    let domain = host.split(':', 1)
    return `
      super();
      String id = null;
      id = "Basic sub";
      logger.info("Sub application is starting");

      this.createConnection("${name}", "${name}", id);
  `
  }