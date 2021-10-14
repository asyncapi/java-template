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

import { DemoSubscriber } from '../demo/DemoSubscriber'
import { DemoProducer } from '../demo/DemoProducer'
import { javaPackageToPath, toJavaClassName } from '../../utils/String.utils';
import { File, render } from '@asyncapi/generator-react-sdk';
import { createJavaConstructorArgs } from '../../utils/Types.utils';
import { ChannelToMessage, PackageDeclaration } from '../Common';

export function Demo(asyncapi, params) {
    let channels = asyncapi.channels();

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
    let channelName = foundPubAndSub ? foundPubAndSub : foundPubOrSub;
    let channel = asyncapi.channel(channelName);

    let message = ChannelToMessage(channel, asyncapi);

    // Handle producer creation
    const producerPath = javaPackageToPath(params.package) + "DemoProducer.java";
    const subscriberPath = javaPackageToPath(params.package) + "DemoSubscriber.java";
    const className = toJavaClassName(channelName);

    const constructorArgs = createJavaConstructorArgs(message.payload).join(', ');
    return [(
            <File name={producerPath}>
                <PackageDeclaration path={params.package} />
                <DemoProducer params={params} messageName={message.name} message={message.payload} className={className} constructorArgs={constructorArgs}></DemoProducer>
            </File>     
    ), (
            <File name={subscriberPath}>
                <PackageDeclaration path={params.package} />
                <DemoSubscriber params={params} className={className}></DemoSubscriber>
            </File>
    )]

} 