/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';
import { CreateConnection } from '../producer/ProducerDeclaration';

/*
  * Each component has a `childrenContent` property.
  * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
  * 
  * Example:
  * function CustomComponent({ childrenContent }) {
  *   return `some text at the beginning: ${childrenContent}`
  * }
  * 
  * function RootComponent() {
  *   return (
  *     <CustomComponent>
  *       some text at the end.
  *     </CustomComponent>
  *   );
  * }
  * 
  * then output from RootComponent will be `some text at the beginning: some text at the end.`.
  */

function getMqValues(url, val) {
  var reg = new RegExp("(?<=ibmmq://.*/).*/.*", "gm");
  const splitVals = reg.exec(url).toString().split("/");
  if (val == 'qmgr')
      return splitVals[0];
  if (val == 'mqChannel')
      return splitVals[1];
    
  }
  
function URLtoHost(url) {
    const u = new URL(url);
    return u.host;
  }
function URLtoPort(url, defaultPort) {
    const u = new URL(url);
    return u.port || defaultPort;
  }


export function ConsumerConstructor({asyncapi, name, params}) {
  const url = asyncapi.server('production1').url() 
  let qmgr = getMqValues(url,'qmgr')
  let mqChannel = getMqValues(url,'mqChannel')
  let host = URLtoHost(url)
  let domain = host.split(':', 1)
  return `
    String id = null;

    switch(type){
        case CONSUMER_SUB :
            id = "Basic sub";
            break;
        case CONSUMER_GET :
            id = "Basic Get";
            break;
    }

    LoggingHelper.init(logger);
    logger.info("Sub application is starting");

    Connection myConnection = new Connection(
      "${domain}",
      ${ URLtoPort(url, 1414) },
      "${mqChannel}",
      "${qmgr}",
      "${params.user}",
      "${params.password}",
      "single/released",
      "single/released",
      null);

    ch = new ConnectionHelper(id, myConnection);

    logger.info("created connection factory");

    context = ch.getContext();
    logger.info("context created");

    switch(type){
        case CONSUMER_SUB :
            destination = ch.getTopicDestination();
            break;
        case CONSUMER_GET :
            destination = ch.getDestination();
            break;
    }

    logger.info("destination created");
`
}



