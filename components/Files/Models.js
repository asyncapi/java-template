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
import { PackageDeclaration, ImportDeclaration, Class, ClassConstructor } from '../Common';
import { ModelClassVariables, ModelConstructor } from '../Model';
import { javaPackageToPath } from '../../utils/String.utils';
import { Indent, IndentationTypes } from '@asyncapi/generator-react-sdk';
import { collateModels, getMessagePayload } from '../../utils/Models.utils';

export function Models(asyncapi, params) {
  const models = collateModels(asyncapi);

  return Object.entries(models).map(([messageName, message]) => {
    const messageNameUpperCase = messageName.charAt(0).toUpperCase() + messageName.slice(1);
    const packagePath = javaPackageToPath(params.package);

    return (
      <File name={`${packagePath}models/${messageNameUpperCase}.java`}>
        <PackageDeclaration path={`${params.package}.models`} />
        <ImportDeclaration path={`${params.package}.models.ModelContract`} />
        <ImportDeclaration path={'java.util.UUID'} />
        <ImportDeclaration path={'com.fasterxml.jackson.annotation.JsonProperty'} />

        <Class name={messageNameUpperCase} extendsClass="ModelContract">
          <Indent size={2} type={IndentationTypes.SPACES}>
            <ModelClassVariables message={message}></ModelClassVariables>
          </Indent>

          <ClassConstructor name={messageNameUpperCase} properties={getMessagePayload(message).properties()}>
            <ModelConstructor message={message}/>
          </ClassConstructor>
          <ClassConstructor name={messageNameUpperCase}>
              super();
          </ClassConstructor>
        </Class>
      </File>
    );
  });
}