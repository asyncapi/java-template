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
    private KafkaProducer producer = null;
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

          ProducerRecord<String, String> record = new ProducerRecord<String, String>(topicName, json);
          producer.send(record);

        }catch (Exception e){
          logger.severe("An error occured whilst attempting to send a message: " + e);
        }
    }`;
}

export function ProducerConstructor({ name }) {
  return `
    super();
    String id = "my-publisher";

    logger.info("Pub application is starting");

    // prepare connection for producer
    createConnection("${name}", id);

    producer = ch.createProducer();
`;
}

export function ProducerClose() {
  return `
    public void close() {
      producer.close();
    }
  `;
}

export function ProducerImports({ params }) {
  return `
import java.util.logging.*;
import java.io.Serializable;
import java.util.UUID;

import ${params.package}.ConnectionHelper;
import ${params.package}.LoggingHelper;
import ${params.package}.Connection;
import ${params.package}.PubSubBase;
import ${params.package}.models.ModelContract;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.annotation.JsonView;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;
  `;
}
