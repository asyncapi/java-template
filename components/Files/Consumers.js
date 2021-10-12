import { File, render } from '@asyncapi/generator-react-sdk';
import {ImportModels, PackageDeclaration, ImportDeclaration, Imports, Class, ClassHeader, ClassConstructor, RecordFaliure, ProcessJMSException, Close } from '../Common';
import {ProducerConstructor, SendMessage } from '../Producer';
import {ConsumerDeclaration, ConsumerImports, ConsumerConstructor, ReceiveMessage } from '../Consumer';
import { toJavaClassName, javaPackageToPath } from '../../utils/String.utils';


export function Consumers(asyncapi, channels, params){
    return Object.entries(channels).map(([channelName, channel]) => {
      const name = channelName
      const className = toJavaClassName(channelName) + 'Subscriber'
  
      // Resolve associated messages this subscriber should support
      // TODO not just import all
      const messages = asyncapi.components().messages();
      const packagePath = javaPackageToPath(params.package);

      if(channel.subscribe()){
        return (
        
          <File name={`${packagePath}${className}.java`}>
            <PackageDeclaration path={params.package}></PackageDeclaration>
            <ConsumerImports asyncapi={asyncapi} params={params}></ConsumerImports>
  
            <ImportModels messages={messages} params={params}></ImportModels>
    
            <Class name={className} extendsClass="PubSubBase">
              <ConsumerDeclaration name={channelName} />
    
              <ClassConstructor name={className}>
                <ConsumerConstructor asyncapi={asyncapi} params={params} name={name}/>
              </ClassConstructor>
        
              <ReceiveMessage asyncapi={asyncapi} name={channelName} channel={channel}></ReceiveMessage>

            </Class>
          </File>
    
        );
      }
    });
  }
