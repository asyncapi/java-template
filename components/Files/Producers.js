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

import { File, render } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration, Imports, Class, ClassHeader, ClassConstructor} from '../Common';
import {ProducerConstructor, SendMessage } from '../Producer';
import { toJavaClassName, javaPackageToPath } from '../../utils/String.utils';

export function Producers(asyncapi, channels, params) {
  return Object.entries(channels).map(([channelName, channel]) => {
    const name = channelName;
    const className = `${toJavaClassName(channelName)  }Producer`;
    const packagePath = javaPackageToPath(params.package);
  
    if (channel.publish()) {
      return (
        
        <File name={`${packagePath}${className}.java`}>
            
          <HeaderContent asyncapi={asyncapi} params={params}></HeaderContent>
    
          <Class name={className} extendsClass="PubSubBase">
            <ClassHeader/>
    
            <ClassConstructor name={className}>
              <ProducerConstructor name={name}/>
                
            </ClassConstructor>
              
            <SendMessage></SendMessage>
              
          </Class>
        </File>
    
      );
    }
  });
}
  
function HeaderContent({ asyncapi, params }) {
  const messages = asyncapi.components().messages();
  return `
  ${render(<PackageDeclaration path={params.package}></PackageDeclaration>)}
  ${render(<Imports params={params}></Imports>)}
  ${render(<ImportModels messages={messages} params={params} />)}
        `;
}