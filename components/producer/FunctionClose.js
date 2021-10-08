/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */

export function Close({ asyncApi, channel }) {
    // TODO one of can be used in message apparently?
    return `
  public void close() {
      ch.closeContext();
      ch = null;
  }`
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