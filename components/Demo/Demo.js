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
  const foundPubAndSub = asyncapi.allChannels().filterBy((chan) => {
    return chan.operations().filterBySend().length > 0 &&
           chan.operations().filterByReceive().length > 0;
  });

  const foundPubOrSub = asyncapi.allChannels().filterBy((chan) => {
    return chan.operations().filterBySend().length > 0 ||
           chan.operations().filterByReceive().length > 0;
  });

  // Prioritise channel with both, fallback to an OR
  const channel = foundPubAndSub.length ? foundPubAndSub[0] : foundPubOrSub[0];
  const channelName = channel.id();

  // Get payload from either publish or subscribe
  const message = channel.messages().all()[0];
  const targetMessageName = message.id();
  const targetPayloadProperties = message.payload().properties();

  const messageNameTitleCase = toJavaClassName(targetMessageName);

  // Handle producer creation
  const producerPath = `${javaPackageToPath(params.package)}DemoProducer.java`;
  const subscriberPath = `${javaPackageToPath(params.package)}DemoSubscriber.java`;
  const className = toJavaClassName(channelName);

  const constructorArgs = createJavaConstructorArgs(targetPayloadProperties).join(', ');
  const generatedClasses = [];
  if (channel.operations().filterBySend().length > 0) {
    generatedClasses.push(
      <File name={producerPath}>
        <PackageDeclaration path={params.package} />
        <DemoProducer params={params} messageName={messageNameTitleCase} className={className} constructorArgs={constructorArgs}></DemoProducer>
      </File>
    );
  }
  if (channel.operations().filterByReceive().length > 0) {
    generatedClasses.push(
      <File name={subscriberPath}>
        <PackageDeclaration path={params.package} />
        <DemoSubscriber params={params} className={className}></DemoSubscriber>
      </File>
    );
  }
  return generatedClasses;
}
