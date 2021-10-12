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
      String id = null;
      id = "Basic pub";

      List<Map> MQ_ENDPOINTS = null;
      Map MQFirst = null;
  
      LoggingHelper.init(logger);
      logger.info("Sub application is starting");

      try {
            // create object mapper instance
            ObjectMapper mapper = new ObjectMapper();
        
            // convert JSON file to map
            Map<Object, List<Map>> map = mapper.readValue(Paths.get("env.json").toFile(), Map.class);
            MQ_ENDPOINTS = map.get("MQ_ENDPOINTS");
            // TODO : Allow switching between multiple endpoints
            MQFirst = MQ_ENDPOINTS.get(0);
        
      } catch (Exception ex) {
            ex.printStackTrace();
      }

      Connection myConnection = new Connection(
        MQFirst.get("HOST").toString(),
        Integer.parseInt(MQFirst.get("PORT").toString()),
        MQFirst.get("CHANNEL").toString(),
        MQFirst.get("QMGR").toString(),
        MQFirst.get("APP_USER").toString(),
        MQFirst.get("APP_PASSWORD").toString(),
        "${name}",
        "${name}",
        null);
  
        ch = new ConnectionHelper(id, myConnection);
        logger.info("created connection factory");
  
    
  
        context = ch.getContext();
        logger.info("context created");
  
        destination = ch.getTopicDestination();
  
        // Set so no JMS headers are sent.
        ch.setTargetClient(destination);
  
        logger.info("destination created");
  
        producer = context.createProducer();
  `
  }
  
  