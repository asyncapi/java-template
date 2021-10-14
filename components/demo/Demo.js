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

import { DemoSubscriber } from '../demo/DemoSubscriber';
import { DemoProducer } from '../demo/DemoProducer';
import { javaPackageToPath, toJavaClassName } from '../../utils/String.utils';
import { File } from '@asyncapi/generator-react-sdk';
import { createJavaConstructorArgs } from '../../utils/Types.utils';
import { PackageDeclaration } from '../Common';

export function Demo(asyncapi, params) {
  const channels = asyncapi.channels();

  // Try to find a pub and sub channel or pub or sub
  let foundPubAndSub;
  let foundPubOrSub;
  for (const property in channels) {
    if ((channels[property].publish || channels[property].subcribe) && !foundPubOrSub) {
      foundPubOrSub = property;
    }
    if (channels[property].publish && channels[property].subcribe) {
      foundPubAndSub = property;
      break;
    }
  }

  // Prioritise channel with both, fallback to an OR
  const channelName = foundPubAndSub ? foundPubAndSub : foundPubOrSub;
  const channel = asyncapi.channel(channelName);

  // Get payload from either publish or subscribe
  const targetPayloadProperties = channel.publish ? channel.publish().message().payload().properties() : channel.subscribe().message().payload().properties();

  // Find message name from messages array
  const messages = asyncapi.components().messages();
  let targetMessageName;
  for (const message in messages) {
    if (messages[message].payload().properties().toString() === targetPayloadProperties.toString()) {
      targetMessageName = message;
    }
  }

  const messageNameTitleCase = targetMessageName.charAt(0).toUpperCase() + targetMessageName.slice(1);

  // Handle producer creation
  const producerPath = `${javaPackageToPath(params.package)  }DemoProducer.java`;
  const subscriberPath = `${javaPackageToPath(params.package)  }DemoSubscriber.java`;
  const className = toJavaClassName(channelName);

  const constructorArgs = createJavaConstructorArgs(targetPayloadProperties).join(', ');
  return [(
    <File name={producerPath}>
      <PackageDeclaration path={params.package} />
      <DemoProducer params={params} messageName={messageNameTitleCase} className={className} constructorArgs={constructorArgs}></DemoProducer>
    </File>     
  ), (
    <File name={subscriberPath}>
      <PackageDeclaration path={params.package} />
      <DemoSubscriber params={params} className={className}></DemoSubscriber>
    </File>
  )];
} 