import { DemoSubscriber } from '../demo/DemoSubscriber'
import { DemoProducer } from '../demo/DemoProducer'
import { javaPackageToPath, toJavaClassName } from '../../utils/String.utils';
import { File, render } from '@asyncapi/generator-react-sdk';
import { createJavaConstructorArgs } from '../../utils/Types.utils';

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

    // Get payload from either publish or subscribe
    let targetPayloadProperties = channel.publish ? channel.publish().message().payload().properties() : channel.subscribe().message().payload().properties();

    // Find message name from messages array
    let messages = asyncapi.components().messages();
    let targetMessageName;
    for (const message in messages) {
        if (messages[message].payload().properties().toString() == targetPayloadProperties.toString()) {
            targetMessageName = message;
        }
    }

    let messageNameTitleCase = targetMessageName.charAt(0).toUpperCase() + targetMessageName.slice(1);

    // Handle producer creation
    const producerPath = javaPackageToPath(params.package) + "DemoProducer.java";
    const subscriberPath = javaPackageToPath(params.package) + "DemoSubscriber.java";
    const className = toJavaClassName(channelName);

    const constructorArgs = createJavaConstructorArgs(targetPayloadProperties).join(', ');
    return [(
            <File name={producerPath}>
                <DemoProducer params={params} messageName={messageNameTitleCase} message={targetPayloadProperties} className={className} constructorArgs={constructorArgs}></DemoProducer>
            </File>     
    ), (
            <File name={subscriberPath}>
                <DemoSubscriber params={params} className={className}></DemoSubscriber>
            </File>
    )]

} 