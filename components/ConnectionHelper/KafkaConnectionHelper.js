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

function getSecurityProtocol(protocol, securitySchemeType) {
  if (protocol === 'kafka') {
    if (securitySchemeType) {
      return 'SASL_PLAINTEXT';
    }
    return 'PLAINTEXT';
  } else if (protocol === 'kafka-secure') {
    if (securitySchemeType) {
      return 'SASL_SSL';
    }
    return 'SSL';
  }
}

function getSecurityConfig({ asyncapi, params }) {
  const server = asyncapi.allServers().get(params.server);
  const protocol = server.protocol();
  const security = server.security();

  let securitySchemeType;
  if (security && security.length > 0) {
    const securityReq = security[0].all();
    if (securityReq && securityReq.length > 0) {
      securitySchemeType = securityReq[0].scheme().type();
    }
  }

  let securityProtocol = getSecurityProtocol(protocol, securitySchemeType);

  let saslMechanism, authModule;
  if (securitySchemeType) {
    switch (securitySchemeType) {
    case 'plain':
      saslMechanism = 'PLAIN';
      authModule = 'org.apache.kafka.common.security.plain.PlainLoginModule';
      break;
    case 'scramSha256':
      saslMechanism = 'SCRAM-SHA-256';
      authModule = 'org.apache.kafka.common.security.scram.ScramLoginModule';
      break;
    case 'scramSha512':
      saslMechanism = 'SCRAM-SHA-512';
      authModule = 'org.apache.kafka.common.security.scram.ScramLoginModule';
      break;
    case 'oauth2':
      saslMechanism = 'OAUTHBEARER';
      authModule = 'org.apache.kafka.common.security.oauthbearer.OAuthBearerLoginModule';
      break;
    case 'gssapi':
      saslMechanism = 'GSSAPI';
      authModule = 'com.sun.security.auth.module.Krb5LoginModule';
      break;
    case 'X509':
      securityProtocol = 'SSL';
      break;
    }
  }

  return { securityProtocol, saslMechanism, authModule };
}

export function ConnectionHelper({ asyncapi, params }) {
  const securityParams = getSecurityConfig({ asyncapi, params });
  return `
import java.util.logging.*;
import java.util.Collections;
import java.util.Properties;

import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;

import ${params.package}.Connection;

public class ConnectionHelper {

    private static final Level LOGLEVEL = Level.ALL;
    private static final Logger logger = Logger.getLogger("${params.package}");

    // Create variables for the connection to Kafka
    private String CLIENT_ID = null;
    private String BOOTSTRAP_ADDRESS = null;
    private String APP_USER = null; // User name that application uses to connect to Kafka
    private String APP_PASSWORD = null; // Password that the application uses to connect to Kafka


    public ConnectionHelper (String id, Connection connection) {
        kafkaConnectionVariables(id, connection);
        logger.info("Application is starting");
    }


    private void kafkaConnectionVariables(String id, Connection connection) {
        CLIENT_ID = id;
        BOOTSTRAP_ADDRESS = connection.BOOTSTRAP_ADDRESS;
        APP_USER = connection.APP_USER;
        APP_PASSWORD = connection.APP_PASSWORD;
    }


    private Properties getProperties() {
        Properties props = new Properties();
        props.put("client.id", CLIENT_ID);
        props.put("bootstrap.servers", BOOTSTRAP_ADDRESS);
        props.put("security.protocol", "${securityParams.securityProtocol}");
        ${ securityParams.saslMechanism ? `props.put("sasl.mechanism", "${securityParams.saslMechanism}");` : ''}
        ${ securityParams.authModule ? `props.put("sasl.jaas.config",
            "${securityParams.authModule} required " +
            "username=\\"" + APP_USER + "\\" " +
            "password=\\"" + APP_PASSWORD + "\\";");` : ''}
        return props;
    }

    public KafkaProducer createProducer() {
        Properties props = getProperties();
        props.put("key.serializer", StringSerializer.class.getName());
        props.put("value.serializer", StringSerializer.class.getName());

        return new KafkaProducer(props);
    }

    public KafkaConsumer createConsumer(String topic) {
        Properties props = getProperties();
        props.put("group.id", CLIENT_ID);
        props.put("key.deserializer", StringDeserializer.class.getName());
        props.put("value.deserializer", StringDeserializer.class.getName());

        KafkaConsumer consumer = new KafkaConsumer(props);
        consumer.subscribe(Collections.singletonList(topic));
        return consumer;
    }
}
`;
}
