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

export function RecordFaliure({ asyncApi }) {
  
    //TODO remove hardcode
    
    return `
    private void recordFailure(Exception ex) {
      if (ex != null) {
          if (ex instanceof JMSException) {
              processJMSException((JMSException) ex);
          } else {
              logger.warning(ex.getMessage());
          }
      }
      logger.info("FAILURE");
      return;
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