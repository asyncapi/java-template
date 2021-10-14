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

export function LoggingHelper() {
  return `   
    import java.util.logging.*;
    
    public class LoggingHelper {
        private static final Level LOGLEVEL = Level.ALL;
    
        public static void init(Logger logger) {
            Logger defaultLogger = Logger.getLogger("");
            Handler[] handlers = defaultLogger.getHandlers();
            if (handlers != null && handlers.length > 0) {
                defaultLogger.removeHandler(handlers[0]);
            }
    
            Handler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(LOGLEVEL);
            logger.addHandler(consoleHandler);
    
            logger.setLevel(LOGLEVEL);
            logger.finest("Logging initialised");
        }
    }
`;
}