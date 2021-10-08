/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';

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

export function ProducerDeclaration({name}) {
return `
  String id = null;
  LoggingHelper.init(logger);
  logger.info("Sub application is starting");
  String queue_name = "${name}";
`
}

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

export function CreateConnection({asyncapi, name, params}) {
  const url = asyncapi.server('production1').url() 
  let qmgr = getMqValues(url,'qmgr')
  let mqChannel = getMqValues(url,'mqChannel')
  let host = URLtoHost(url)
  let domain = host.split(':', 1)

  return`
  Connection myConnection = new Connection(
    "${domain}",
    ${ URLtoPort(url, 1414) },
    "${mqChannel}",
    "${qmgr}",
    "${params.user}",
    "${params.password}",
    ${name},
    ${name},
    null);
    
    ch = new ConnectionHelper(id, myConnection);
    logger.info("created connection factory");


    context = ch.getContext();
    logger.info("context created");

    // Set so no JMS headers are sent.
    ch.setTargetClient(destination);

    logger.info("destination created");

    producer = context.createProducer();
    }
    `
  }



