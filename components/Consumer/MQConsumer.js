/*
* (c) Copyright IBM Corporation 2023
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
import { toJavaClassName } from '../../utils/String.utils';
import { getApi } from '../../utils/DependencyResolver.utils';

export function ConsumerDeclaration() {
  return `
  private JMSConsumer consumer = null;
    `;
}

export function ConsumerImports({ server, params, message }) {
  const jmsPrefix = getApi(server.protocol(), params.messagingApi).base;
  return `
import java.util.logging.*;
import java.io.Serializable;

import ${jmsPrefix}.Destination;
import ${jmsPrefix}.JMSConsumer;
import ${jmsPrefix}.JMSContext;
import ${jmsPrefix}.Message;
import ${jmsPrefix}.TextMessage;
import ${jmsPrefix}.JMSRuntimeException;
import ${jmsPrefix}.JMSException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;

import ${params.package}.ConnectionHelper;
import ${params.package}.LoggingHelper;
import ${params.package}.Connection;
import ${params.package}.PubSubBase;

import ${params.package}.models.ModelContract;
import ${params.package}.models.${toJavaClassName(message.uid())};
`;
}

export function ReceiveMessage({ message }) {
  return `
  public void receive(int requestTimeout) {
    boolean continueProcessing = true;

    consumer = context.createConsumer(destination);
    logger.info("consumer created");

    while (continueProcessing) {
        try {
            // Receive message from MQ
            Message receivedMessage = consumer.receive(requestTimeout);

            // Check message has been received
            if (receivedMessage == null) {
                logger.info("No message received from this endpoint");
                continue;
            }

            // Find message type
            if (receivedMessage instanceof TextMessage) {
                TextMessage textMessage = (TextMessage) receivedMessage;
                try {
                    logger.info("Received message: " + textMessage.getText());
                    ${toJavaClassName(message.uid())} receivedObject = new ObjectMapper().readValue(textMessage.getText(), ${toJavaClassName(message.uid())}.class);
                    logger.info("Received message type: " + receivedObject.getClass().getName());

                    /*
                     * Implement your business logic to handle
                     * received messages here.
                     */
                    
                } catch (JMSException jmsex) {
                    recordFailure(jmsex);
                } catch (JsonProcessingException jsonproex) {
                    recordFailure(jsonproex);
                }
            } else if (receivedMessage instanceof Message) {
                logger.info("Message received was not of type TextMessage.");
            } else {
                logger.info("Received object not of JMS Message type.");
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
  `;
}
  
export function ConsumerConstructor({ name }) {
  return `
      super();
      String id = null;
      id = "Basic sub";
      logger.info("Sub application is starting");

      this.createConnection("${name}", id);
  `;
}

export function ConsumerClose() {
  // handled by superclass
  return '';
}
