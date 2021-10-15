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
import { ImportModels, PackageDeclaration, Class, ClassHeader, ClassConstructor } from '../Common';
import { ProducerConstructor, SendMessage, ProducerImports } from '../Producer';
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
          <ProducerImports params={params} />
          <ImportModels messages={messages} params={params} />
    
          <Class name={className} extendsClass="PubSubBase">
            <ClassHeader />
    
            <ClassConstructor name={className}>
              <ProducerConstructor name={name} />
            </ClassConstructor>
              
            <SendMessage />
              
          </Class>
        </File>
      );
    }
  });
}
