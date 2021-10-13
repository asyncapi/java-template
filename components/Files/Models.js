import { File, render } from '@asyncapi/generator-react-sdk';
import {PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close} from '../Common';
import {ImportModels, ModelClassVariables, ModelConstructor } from '../Model';
import { javaPackageToPath } from '../../utils/String.utils';


export function Models(messages, params){
    return Object.entries(messages).map(([messageName, message]) => {
      let messageNameUpperCase = messageName.charAt(0).toUpperCase() + messageName.slice(1);
      const packagePath = javaPackageToPath(params.package);

      return (
        <File name={`${packagePath}models/${messageNameUpperCase}.java`}>
          <PackageDeclaration path={`${params.package}.models`} />
          <ImportDeclaration path={`${params.package}.models.ModelContract`} />

          <Class name={messageNameUpperCase} extendsClass="ModelContract">
            {/* Declare local class vars */}

            <ModelClassVariables message={message}></ModelClassVariables>

            <ClassConstructor name={messageNameUpperCase} properties={message.payload().properties()}>
              <ModelConstructor message={message}/>
            </ClassConstructor>
          </Class>
        </File>
      )
    });
  }