/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

export function ProducerDeclaration() {
  return `
    private JMSProducer producer = null;
  `;
}

export function SendMessage() {
  return `
    public void send(ModelContract modelContract) { 
        Serializable modelInstance = (Serializable) modelContract;

        try{
          // JSON encode and transmit
          ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
          String json = ow.writeValueAsString(modelInstance);
  
          logger.info("Sending Message: " + json);
  
          this.producer.send(destination, json);
            
        }catch (JsonProcessingException e){
          logger.severe("An error occured whilst attempting to send a message: " + e);
        }
    }`;
}
  
export function ProducerConstructor({ name }) {
  return `
    super();
    String id = null;
    id = "Basic pub";

    logger.info("Pub application is starting");

    // Establish connection for producer
    this.createConnection("${name}", id);

    // Set so no JMS headers are sent.
    ch.setTargetClient(destination);
    producer = context.createProducer();
`;
}

export function ProducerClose() {
  // handled by superclass
  return '';
}

export function ProducerImports({ params }) {
  return `
import java.util.logging.*;
import java.io.Serializable;
import java.util.UUID;

import javax.jms.Destination;
import javax.jms.JMSProducer;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.JMSRuntimeException;
import javax.jms.ObjectMessage;


import ${params.package}.ConnectionHelper;
import ${params.package}.LoggingHelper;
import ${params.package}.Connection;
import ${params.package}.PubSubBase;
import ${params.package}.models.ModelContract;

import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;
  `;
}