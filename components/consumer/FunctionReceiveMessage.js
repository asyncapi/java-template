/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */

function createJavaArgs(properties){
    return Object.entries(properties).map(([name, property]) => {
        return `${toJavaType(property.type())} ${name}`
    })
}

function passJavaArgs(properties){
    return Object.entries(properties).map(([name, property]) => {
        return `${name}`
    })
}

export function ReceiveMessage({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?
    let properties = channel.subscribe().message().payload().properties();

    let args = createJavaArgs(properties);

    let message = channel.subscribe().message();
    
    console.log("name", channel.subscribe().message())

    //TODO remove hardcode
    
    return `
    public void receive(int requestTimeout) {
      boolean continueProcessing = true;

      consumer = context.createConsumer(destination);
      logger.info("consumer created");

      while (continueProcessing) {
          try {
              Message receivedMessage = consumer.receive(requestTimeout);
              if (receivedMessage == null) {
                  logger.info("No message received from this endpoint");
                //    continueProcessing = false;       THIS IS COMMENTED FOR TESTING PURPOSES, UNCOMMENT WHEN DONE
              } else {
                if (receivedMessage instanceof TextMessage) {
                    TextMessage textMessage = (TextMessage) receivedMessage;
                    try {
                        logger.info("Received message: " + textMessage.getText());
                        Single receivedSingleObject = new ObjectMapper().readValue(textMessage.getText(), Single.class); // HARDCODED, REACTIFY

                        System.out.println("TYPE: " + receivedSingleObject.getClass().getName()); // REMOVE THIS EVENTUALLY BUT GOOD FOR DEMO
                        System.out.println(receivedSingleObject.toString()); // REMOVE EITHER THIS OR logger.info(Received...

                    } catch (JMSException jmsex) {
                        recordFailure(jmsex);
                    } catch (JsonProcessingException jsonproex) {
                        recordFailure(jsonproex);
                    }
                } else if (receivedMessage instanceof Message) {
                    logger.info("Message received was not of type TextMessage.");
                } else {
                    logger.info("Received object not of JMS Message type!");
                }
              }
          } catch (JMSRuntimeException jmsex) {
              jmsex.printStackTrace();
              try {
                  Thread.sleep(1000);
              } catch (InterruptedException e) {
              }
          }
       }
    }
`
}
  

function toJavaType(asyncApiType) {
    switch (asyncApiType){
      
      case "integer":
        return "int"
  
      case "long":
        return "Long"
  
      case "float":
        return "float"
  
      case "double":
        return "double"
  
      case "string":
        return "String"
        
      case "byte":
        return "byte"
    
      case "binary":
        return "String"
  
      case "boolean":
        return "boolean"
  
      case "date":
        return "String"
  
      case "dateTime":
        return "String"
  
      case "password":
        return "String"
    }
  }