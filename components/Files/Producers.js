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
import { ImportModels, PackageDeclaration, Class, ClassConstructor } from '../Common';
import { ProducerConstructor, SendMessage, ProducerImports, ProducerDeclaration, ProducerClose } from '../Producer/index';
import { toJavaClassName, javaPackageToPath } from '../../utils/String.utils';

export function Producers(asyncapi, channels, params) {
  return Object.entries(channels).map(([channelName, channel]) => {
    const name = channelName;
    const className = `${toJavaClassName(channelName)}Producer`;
    const packagePath = javaPackageToPath(params.package);
    const messages = asyncapi.components().messages();

    if (channel.publish()) {
      return (
        <File name={`${packagePath}${className}.java`}>
            
          <PackageDeclaration path={params.package} />
          <ProducerImports asyncapi={asyncapi} params={params} />
          <ImportModels messages={messages} params={params} />
    
          <Class name={className} extendsClass="PubSubBase">
            <ProducerDeclaration asyncapi={asyncapi} params={params} />
    
            <ClassConstructor name={className}>
              <ProducerConstructor asyncapi={asyncapi} params={params} name={name} />
            </ClassConstructor>

            <SendMessage asyncapi={asyncapi} params={params} />

            <ProducerClose asyncapi={asyncapi} params={params} />
          </Class>
        </File>
      );
    }
  });
}
