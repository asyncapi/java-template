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

// Import custom components from file 
import { PackageDeclaration, EnvJson } from '../components/Common';
import { javaPackageToPath } from '../utils/String.utils';

import { Connection } from '../components/Connection';
import { ConnectionHelper } from '../components/ConnectionHelper';
import { LoggingHelper } from '../components/LoggingHelper';
import { PomHelper } from '../components/PomHelper';
import { Demo } from '../components/demo/Demo';
import { PubSubBase } from '../components/Files/PubSubBase';
import { ModelContract } from '../components/ModelContract';
import { Readme } from '../components/Readme';

import { Models } from '../components/Files/Models';
import { Producers } from '../components/Files/Producers';
import { Consumers } from '../components/Files/Consumers';

export default function({ asyncapi, params }) {
  if (!asyncapi.hasComponents()) {
    return null;
  }

  const channels = asyncapi.channels();
  const server = asyncapi.server(params.server);

  const toRender = {
    producers: Producers(asyncapi, channels, params),
    connectionHelper: ConnectionHelperRenderer(params),
    models: Models(asyncapi.components().messages(), params),
    consumers: Consumers(asyncapi, channels, params),
    loggingHelper: LoggingHelperRenderer(params),
    connectionRender: ConnectionRender(params),
    envJson: EnvJsonRenderer(asyncapi, params),
    pubSubBase: PubSubBase(params),
    pomXml: PomXmlRenderer(server, params),
    demo: Demo(asyncapi, params),
    ModelContract: ModelContractRenderer(params),
    readmeRenderer: ReadmeRenderer(asyncapi, params)
  };

  // Schemas is an instance of the Map
  return Object.entries(toRender).map(([name, renderFunction]) => {
    return renderFunction;
  }).flat();
}

function LoggingHelperRenderer(params) {
  const filePath = `${javaPackageToPath(params.package)}LoggingHelper.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <LoggingHelper />
    </File>
  );
}

function ModelContractRenderer(params) {
  const filePath = `${javaPackageToPath(params.package)}models/ModelContract.java`;
  const pkg = `${params.package}.models`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={pkg} />
      <ModelContract />
    </File>
  );
}

function ConnectionRender(params) {
  const filePath = `${javaPackageToPath(params.package)}Connection.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <Connection />
    </File>
  );
}

function ConnectionHelperRenderer(params) {
  const filePath = `${javaPackageToPath(params.package)}ConnectionHelper.java`;
  return (
    <File name={filePath}>
      <PackageDeclaration path={params.package} />
      <ConnectionHelper params={params} />
    </File>
  );
}

function EnvJsonRenderer(asyncapi, params) {
  return (
    <File name='/env.json'>
      <EnvJson asyncapi={asyncapi} params={params} />
    </File>
  );
}

function PomXmlRenderer(server, params) {
  return (
    <File name='/pom.xml'>
      <PomHelper params={params} server={server} />
    </File>
  );
}

function ReadmeRenderer(asyncapi, params) {
  return (
    <File name='/README.md'>
      <Readme asyncapi={asyncapi} params={params} />
    </File>
  );
}