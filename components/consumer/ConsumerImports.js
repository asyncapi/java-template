/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */


export function ConsumerImports({ asyncApi, messageNames }) {
    return `
import java.util.logging.*;

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