import { getMqValues, URLtoHost, URLtoPort } from './Common';
import { createJavaArgsFromProperties, passJavaArgs } from '../utils/Types.utils'

// Send Message
export function SendMessage({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?
    let properties = channel.subscribe().message().payload().properties();
  
    let args = createJavaArgsFromProperties(properties);
  
    let message = channel.subscribe().message();
    
    console.log("name", channel.subscribe().message())
  
    //TODO remove hardcode
    
    return `
    public void sendSingle(${args.join(', ')}) {
        // First create instance of model
        Serializable single = new Single(
            ${passJavaArgs(properties)}
        );
  
        try{
            ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
            String json = ow.writeValueAsString(single);
    
            System.out.println(json);
  
            this.producer.send(destination, json);
            
        }catch (JsonProcessingException e){
            System.out.println(e);
        }
    }`
  }
  
  export function ProducerConstructor({asyncapi, name, params}) {
    const url = asyncapi.server('production1').url() 
    let qmgr = getMqValues(url,'qmgr')
    let mqChannel = getMqValues(url,'mqChannel')
    let host = URLtoHost(url)
    let domain = host.split(':', 1)
  
    return `
      super();
      String id = null;
      id = "Basic pub";
  
      logger.info("Sub application is starting");
  
  
      this.createConnection("${name}", "${name}", id);
  
        // Set so no JMS headers are sent.
        ch.setTargetClient(destination);
        producer = context.createProducer();
  `
  }
  
  