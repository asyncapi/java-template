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

import { DemoSubscriber } from './DemoSubscriber';
import { DemoProducer } from './DemoProducer';
import { javaPackageToPath, toJavaClassName } from '../../utils/String.utils';
import { File } from '@asyncapi/generator-react-sdk';
import { createJavaConstructorArgs } from '../../utils/Types.utils';
import { PackageDeclaration } from '../Common';

export function Demo(asyncapi, params) {
  const channels = Object.entries(asyncapi.channels()).map(([key, value]) => ({key,value}));

  const foundPubAndSub = channels.filter((el) => {
    return el.value.publish && el.value.subscribe;
  });

  const foundPubOrSub = channels.filter((el) => {
    return el.value.publish || el.value.subscribe;
  });

  // Prioritise channel with both, fallback to an OR
  const channel = foundPubAndSub.length ? foundPubAndSub[0] : foundPubOrSub[0];
  const channelName = channel.key;

  // Get payload from either publish or subscribe
  const targetMessageName = channel.value.publish ? channel.value.publish().message().uid() : channel.value.subscribe().message().uid();
  const targetPayloadProperties = channel.value.publish ? channel.value.publish().message().payload().properties() : channel.value.subscribe().message().payload().properties();

  const messageNameTitleCase = toJavaClassName(targetMessageName);

  // Handle producer creation
  const producerPath = `${javaPackageToPath(params.package)}DemoProducer.java`;
  const subscriberPath = `${javaPackageToPath(params.package)}DemoSubscriber.java`;
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