import { getMqValues, URLtoHost, URLtoPort } from './Common';
import { createJavaArgsFromProperties } from '../utils/Types.utils'


export function ConsumerDeclaration({name}) {
    return `
      private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");
    
      public static final String CONSUMER_SUB = "topic";
      public static final String CONSUMER_GET = "queue";
    
      private JMSContext context = null;
      private Destination destination = null;
      private JMSConsumer consumer = null;
      private ConnectionHelper ch = null;
    `
    }
     

export function ConsumerImports({ asyncApi, messageNames }) {
return `
    import java.util.logging.*;
    import java.util.Map;
    import java.util.List;
    import java.nio.file.Paths;
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
    
    
    import com.ibm.mq.samples.jms.ConnectionHelper;
    import com.ibm.mq.samples.jms.LoggingHelper;
    import com.ibm.mq.samples.jms.Connection;
        
    `
}

export function ReceiveMessage({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?
    let properties = channel.subscribe().message().payload().properties();
  
    let args = createJavaArgsFromProperties(properties);
  
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
  
  export function ConsumerConstructor({asyncapi, name, params}) {
    const url = asyncapi.server('production1').url() 
    let qmgr = getMqValues(url,'qmgr')
    let mqChannel = getMqValues(url,'mqChannel')
    let host = URLtoHost(url)
    let domain = host.split(':', 1)
    return `
      String id = null;
      id = "Basic sub";

      List<Map> MQ_ENDPOINTS = null;
      Map MQFirst = null;
  
      LoggingHelper.init(logger);
      logger.info("Sub application is starting");
  
        try {
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();
        
            // convert JSON file to map
            Map<Object, List<Map>> map = mapper.readValue(Paths.get("env.json").toFile(), Map.class);
            MQ_ENDPOINTS = map.get("MQ_ENDPOINTS");
            // TODO : Allow switching between multiple endpoints
            MQFirst = MQ_ENDPOINTS.get(0);
        
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        Connection myConnection = new Connection(
            MQFirst.get("HOST").toString(),
            Integer.parseInt(MQFirst.get("PORT").toString()),
            MQFirst.get("CHANNEL").toString(),
            MQFirst.get("QMGR").toString(),
            MQFirst.get("APP_USER").toString(),
            MQFirst.get("APP_PASSWORD").toString(),
            "${name}",
            "${name}",
            null);
  
      ch = new ConnectionHelper(id, myConnection);
  
      logger.info("created connection factory");
  
      context = ch.getContext();
      logger.info("context created");
  
      destination = ch.getTopicDestination();
  
  
      logger.info("destination created");
  `
  }