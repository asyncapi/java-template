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

import { File } from '@asyncapi/generator-react-sdk';
import { javaPackageToPath } from '../../utils/String.utils';
import { PackageDeclaration } from '../Common';

function getPubSubContent(params) {
  return `

    import java.util.logging.*;
    import java.util.Map;
    import java.util.List;
    import java.nio.file.Paths;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.ObjectWriter;

    import ${params.package}.ConnectionHelper;
    import ${params.package}.LoggingHelper;

    import javax.jms.Destination;
    import javax.jms.JMSContext;
    import javax.jms.JMSRuntimeException;
    import javax.jms.JMSException;


    public class PubSubBase {

        protected static final Logger logger = Logger.getLogger("${params.package}");

        protected ConnectionHelper ch = null;
        protected JMSContext context = null;
        protected Destination destination = null;

        // TODO : what is this for?
        public void Base(){
            LoggingHelper.init(logger);
        }

        public void createConnection(String topicName, String id){
          // Retrieve first MQ endpoint from env.json
          List<Map> MQ_ENDPOINTS = null;
          Map MQFirst = null;

          try {
            ObjectMapper mapper = new ObjectMapper();

            // Convert JSON file to map
            Map<Object, List<Map>> map = mapper.readValue(Paths.get("env.json").toFile(), Map.class);
            MQ_ENDPOINTS = map.get("MQ_ENDPOINTS");
            // TODO : Allow switching between multiple endpoints
            MQFirst = MQ_ENDPOINTS.get(0);

          } catch (Exception ex) {
                ex.printStackTrace();
          }

          // Create connection definition from env variables
          Connection myConnection = new Connection(
            MQFirst.get("HOST").toString(),
            Integer.parseInt(MQFirst.get("PORT").toString()),
            MQFirst.get("CHANNEL").toString(),
            MQFirst.get("QMGR").toString(),
            MQFirst.get("APP_USER").toString(),
            MQFirst.get("APP_PASSWORD").toString(),
            null,
            topicName,
            null);

          // Build connection helper
          ch = new ConnectionHelper(id, myConnection);

          logger.info("created connection factory");

          // Create context and set local topic destination
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

    `;
}

export function PubSubBase(params) {
  const packagePath = javaPackageToPath(params.package);
  return (
    <File name={`${packagePath}PubSubBase.java`}>
      <PackageDeclaration path={params.package} />
      {getPubSubContent(params)}
    </File>
  );
}
