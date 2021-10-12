import { File, render } from '@asyncapi/generator-react-sdk';

let pubSubContent = `
package com.ibm.mq.samples.jms;

import java.util.logging.*;

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

        
      Connection myConnection = new Connection(
        "localhost",
        1414,
        "DEV.APP.SVRCONN",
        "QM1",
        "app",
        "password",
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

export function PubSubBase(){
  return (
    <File name={`/com/ibm/mq/samples/jms/PubSubBase.java`}>
      {pubSubContent}
    </File>
  )
  
  }
