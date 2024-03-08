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
import { PackageDeclaration, Class, ClassConstructor } from '../Common';
import { ConsumerDeclaration, ConsumerImports, ConsumerConstructor, ReceiveMessage, ConsumerClose } from '../Consumer/index';
import { toJavaClassName, javaPackageToPath } from '../../utils/String.utils';

export function Consumers(asyncapi, channels, params) {
  return channels.map((channel) => {
    if (channel.operations().filterByReceive().length > 0) {
      const name = channel.id();
      const className = `${toJavaClassName(name)}Subscriber`;

      const packagePath = javaPackageToPath(params.package);

      const message = channel.messages().all()[0];

      return (
        <File name={`${packagePath}${className}.java`}>
          <PackageDeclaration path={params.package}></PackageDeclaration>
          <ConsumerImports asyncapi={asyncapi} params={params} message={message}></ConsumerImports>
    
          <Class name={className} extendsClass="PubSubBase">
            <ConsumerDeclaration asyncapi={asyncapi} params={params} name={name} />
  
            <ClassConstructor name={className}>
              <ConsumerConstructor asyncapi={asyncapi} params={params} name={name}/>
            </ClassConstructor>

            <ReceiveMessage asyncapi={asyncapi} params={params} message={message}></ReceiveMessage>

            <ConsumerClose asyncapi={asyncapi} params={params} />
          </Class>
        </File> 
      );
    }
  });
}