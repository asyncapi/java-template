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

import { File } from '@asyncapi/generator-react-sdk';
import { javaPackageToPath } from '../../utils/String.utils';
import { PackageDeclaration } from '../Common';

function getPubSubContent({ server, params }) {
  return `

    import java.util.logging.*;
    import java.util.Map;
    import java.util.List;
    import java.nio.file.Paths;
    import com.fasterxml.jackson.databind.ObjectMapper;
    import com.fasterxml.jackson.databind.ObjectWriter;

    import ${params.package}.ConnectionHelper;
    import ${params.package}.LoggingHelper;


    public class PubSubBase {

        protected static final Logger logger = Logger.getLogger("${params.package}");

        protected ConnectionHelper ch = null;
        protected String topicName = null;

        public PubSubBase(){
            LoggingHelper.init(logger);
        }

        public void createConnection(String topicName, String id){
          this.topicName = topicName;

          // Retrieve first Kafka endpoint from env.json
          List<Map> KAFKA_ENDPOINTS = null;
          Map KafkaFirst = null;

          try {
            ObjectMapper mapper = new ObjectMapper();

            // Convert JSON file to map
            Map<Object, List<Map>> map = mapper.readValue(Paths.get("env.json").toFile(), Map.class);
            KAFKA_ENDPOINTS = map.get("KAFKA_ENDPOINTS");
            // TODO : Allow switching between multiple endpoints
            KafkaFirst = KAFKA_ENDPOINTS.get(0);

          } catch (Exception ex) {
                ex.printStackTrace();
          }

          // Create connection definition from env variables
          Connection myConnection = new Connection(
            KafkaFirst.get("BOOTSTRAP_ADDRESS").toString(),
            KafkaFirst.get("APP_USER").toString(),
            KafkaFirst.get("APP_PASSWORD").toString());

          // Build connection helper
          ch = new ConnectionHelper(id, myConnection);

          logger.info("created connection factory");
        }

        protected void recordFailure(Exception ex) {
          if (ex != null) {
            logger.warning(ex.getMessage());
          }
        }
    }

    `;
}

export function PubSubBase({ server, params }) {
  const packagePath = javaPackageToPath(params.package);
  return (
    <File name={`${packagePath}PubSubBase.java`}>
      <PackageDeclaration path={params.package} />
      {getPubSubContent({ server, params })}
    </File>
  );
}
