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

import { createJavaArgsFromProperties } from '../utils/Types.utils';
import { collateModelNames } from '../utils/Models.utils';

export function Class({ childrenContent, name, implementsClass, extendsClass }) {
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
    throw new Error('Invalid URL passed into getMqValues function');
  }

  const splitVals = regString.toString().split('/');
  if (splitVals.length === 2) { 
    if (val === 'qmgr')
      return splitVals[0];
    if (val === 'mqChannel')
      return splitVals[1];
    
    throw new Error('Invalid parameter passed into getMqValues function');
  }
  throw new Error('Invalid URL passed into getMqValues function');
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

export function EnvJson({ asyncapi, params }) {
  const url = asyncapi.server(params.server).url();
  const protocol = asyncapi.server(params.server).protocol();
  let user = params.user;
  let password = params.password;

  if (user === 'app' && process.env.APP_USER) {
    user = process.env.APP_USER;
  }

  if (password === 'passw0rd' && process.env.APP_PASSWORD) {
    password = process.env.APP_PASSWORD;
  }

  if (protocol === 'ibmmq' || protocol === 'ibmmq-secure') {
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
        "APP_USER": "${user}",
        "APP_PASSWORD": "${password}"
      }]
    }
    `;
  } else if (protocol === 'kafka' || protocol === 'kafka-secure') {
    return `
    {
      "KAFKA_ENDPOINTS": [{
        "BOOTSTRAP_ADDRESS": "${url}",
        "APP_USER": "${user}",
        "APP_PASSWORD": "${password}"
      }]
    }
    `;
  }
  // placeholder for new protocols
  return `
  {
  }
  `;
}

export function ImportModels({ asyncapi, params }) {
  const modelNames = collateModelNames(asyncapi);

  return modelNames.map(messageName => {
    return `
import ${params.package}.models.${messageName};`;
  });
}

/* Used to resolve a channel object to message name */
export function ChannelToMessage(channel, asyncapi) {
  // Get payload from either publish or subscribe
  const targetPayloadProperties = Object.prototype.hasOwnProperty.call(channel, 'publish') ? 
    channel.publish().message().payload().properties() :
    channel.subscribe().message().payload().properties();

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
