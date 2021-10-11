import { File, render } from '@asyncapi/generator-react-sdk';
import {PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close} from '../Common';
import {ImportModels, ModelClassVariables, ModelConstructor } from '../Model';


export function Models(messages){
    return Object.entries(messages).map(([messageName, message]) => {
      let messageNameUpperCase = messageName.charAt(0).toUpperCase() + messageName.slice(1);

      return (
        <File name={`/com/ibm/mq/samples/jms/models/${messageNameUpperCase}.java`}>
          <PackageDeclaration path={`com.ibm.mq.samples.jms.models`} />
          <ImportDeclaration path={`java.io.Serializable`} />


          <Class name={messageNameUpperCase} implementsClass="Serializable">
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