import { File, render } from '@asyncapi/generator-react-sdk';

function getPubSubContent(){
    return `package com.ibm.mq.samples.jms;

    import java.util.logging.*;
    import java.util.Map;
    import java.util.List;
    import java.nio.file.Paths;
    import com.fasterxml.jackson.databind.ObjectMapper; 
    import com.fasterxml.jackson.databind.ObjectWriter; 

    import com.ibm.mq.samples.jms.ConnectionHelper;
    import com.ibm.mq.samples.jms.LoggingHelper;
    
    import javax.jms.Destination;
    import javax.jms.JMSContext;
    import javax.jms.JMSRuntimeException;
    import javax.jms.JMSException;
    
    
    public class PubSubBase {
        
        protected static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");
        
        protected ConnectionHelper ch = null;
        protected JMSContext context = null;
        protected Destination destination = null;
    
        public void Base(){
            LoggingHelper.init(logger);
        }
    
        public void createConnection(String queueName, String topicName, String id){
    
          List<Map> MQ_ENDPOINTS = null;
          Map MQFirst = null;
    
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
            queueName,
            topicName,
            null);
      
          ch = new ConnectionHelper(id, myConnection);
      
          logger.info("created connection factory");
      
          context = ch.getContext();
          logger.info("context created");
    
          destination = ch.getTopicDestination();
    
          logger.info("destination created");
        }
    
        public void close() {
            ch.closeContext();
            ch = null;
        }
        
        protected void recordFailure(Exception ex) {
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
    
        protected void processJMSException(JMSException jmsex) {
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
    }
    
    `
}


export function PubSubBase(){
  return (
    <File name={`/com/ibm/mq/samples/jms/PubSubBase.java`}>
      {getPubSubContent()}
    </File>
  )
  
  }
