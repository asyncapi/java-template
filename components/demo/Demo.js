import { DemoSubscriber } from '../demo/DemoSubscriber'
import { DemoProducer } from '../demo/DemoProducer'
import { javaPackageToPath } from '../../utils/String.utils';
import { File, render } from '@asyncapi/generator-react-sdk';

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

    // Handle producer creation
    const producerPath = javaPackageToPath(params.package) + "DemoProducer.java";
    const subscriberPath = javaPackageToPath(params.package) + "DemoSubscriber.java";
    return [(
            <File name={producerPath}>
                <DemoProducer params={params}></DemoProducer>
            </File>     
    ), (
            <File name={subscriberPath}>
                <DemoSubscriber params={params}></DemoSubscriber>
            </File>
    )]

} 