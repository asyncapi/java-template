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

/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */
import { createJavaArgsFromProperties } from '../utils/Types.utils';
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

export function Class({childrenContent, name, implementsClass, extendsClass }) {
  if (childrenContent === undefined) { 
    childrenContent = '';
  }

  let implementsString = '';

  if (implementsClass !== undefined) {
    implementsString = `implements ${implementsClass}`;
  }

  let extendsString = '';

  if (extendsClass !== undefined) {
    extendsString = `extends ${extendsClass}`;
  }

  return `
public class ${name} ${implementsString} ${extendsString}{
${childrenContent}
}
`;
}

export function ClassHeader() {
  return `
  private JMSProducer producer = null;
`;
}

export function ClassConstructor({ childrenContent, name, properties }) {
  let propertiesString = '';

  if (properties) {
    propertiesString = createJavaArgsFromProperties(properties);
  }

  return `
  public ${name}(${propertiesString}) {
    ${childrenContent}
  }`;
}

export function PackageDeclaration({ path }) {
  return `
${javaCopyright()}
package ${path};
  `;
}

export function ImportDeclaration({path}) {
  return `
import ${path};`;
}

export function getMqValues(url, val) {
  const reg = new RegExp('(?<=ibmmq://.*/).*/.*', 'gm');
  const regString = reg.exec(url);
  if (regString === null) {
    return 'Invalid URL passed into getMqValues function'; 
  }

  const splitVals = regString.toString().split('/');
  if (splitVals.length === 2) { 
    if (val === 'qmgr')
      return splitVals[0];
    if (val === 'mqChannel')
      return splitVals[1];
    
    return 'Invalid parameter passed into getMqValues function';
  }
  
  return 'Invalid URL passed into getMqValues function';
}
  
export function URLtoHost(url) {
  const u = new URL(url);
  return u.host;
}
export function URLtoPort(url, defaultPort) {
  const u = new URL(url);
  if (u.port === '')
    return defaultPort;
  return u.port;
}

export function Close() {
  return `
public void close() {
    ch.closeContext();
    ch = null;
}`;
}

export function EnvJson({ asyncapi, params}) {
  const url = asyncapi.server(params.server).url(); 
  const qmgr = getMqValues(url,'qmgr');
  const mqChannel = getMqValues(url,'mqChannel');
  const host = URLtoHost(url);
  const domain = host.split(':', 1);
  return `
  {
    "MQ_ENDPOINTS": [{
      "HOST": "${domain}",
      "PORT": "${ URLtoPort(url, 1414) }",
      "CHANNEL": "${mqChannel}",
      "QMGR": "${qmgr}",
      "APP_USER": "${params.user}",
      "APP_PASSWORD": "${params.password}"
    }]
  }
  `;
}
export function ImportModels({ messages, params }) {
  return Object.entries(messages)
    .map(([messageName, message]) => {
      return `import ${params.package}.models.${messageName.charAt(0).toUpperCase() + messageName.slice(1)};`;
    });
}

/* Used to resolve a channel object to message name */
export function ChannelToMessage(channel, asyncapi) {
  // Get payload from either publish or subscribe
  const targetPayloadProperties = Object.prototype.hasOwnProperty.call(channel, 'publish') ? channel.publish().message().payload().properties() : channel.subscribe().message().payload().properties();

  // Find message name from messages array
  const messages = asyncapi.components().messages();
  let targetMessageName;
  for (const message in messages) {
    if (messages[message].payload().properties().toString() === targetPayloadProperties.toString()) {
      targetMessageName = message;
    }
  }

  const messageNameTitleCase = targetMessageName.charAt(0).toUpperCase() + targetMessageName.slice(1);

  return {
    payload: targetPayloadProperties,
    name: messageNameTitleCase
  };
}

export function javaCopyright() {
  return `/*
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
*/`;
}