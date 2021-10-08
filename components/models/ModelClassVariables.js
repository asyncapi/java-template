/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */

function defineJavaVars(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `public ${toJavaType(property.type())} ${name};`
  })
}

export function ModelClassVariables({ asyncApi, message }) {
    // TODO one of can be used in message apparently?
    console.log("Message", message)

    let argsString = defineJavaVars(message.payload().properties());

    
    console.log("Args", argsString)

    return argsString.join(`
    `)
    // //TODO remove hardcode
    
    // return `
    // public void sendSingle(${args.join(', ')}) {
    //     // First create instance of model
    //     Serializable single = new Single(
    //         ${passJavaArgs(properties)}
    //     );

    //     try{
    //         ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    //         String json = ow.writeValueAsString(single);
    
    //         System.out.println(json);
    //     }catch (JsonProcessingException e){
    //         System.out.println(e);
    //     }
    // }`
    return ``
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