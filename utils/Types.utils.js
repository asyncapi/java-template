/* 
 * Converts from async api defined types (https://www.asyncapi.com/docs/specifications/v2.0.0#dataTypeFormat)
 * to native Java types
 */
export function asyncApiTypeToJavaType(asyncApiType) {
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

/* 
 * Helper class to easily assign local class properties
 */
export function setLocalVariables(properties){
    return Object.entries(properties).map(([name, property]) => {
        return `
    this.${name} = ${name};
  `
    })
  }
  
/* 
 * Helper class to define variables 
 */
export function defineVariablesForProperties(properties){
    return Object.entries(properties).map(([name, property]) => {
        return `public ${toJavaType(property.type())} ${name};`
    })
  }

/* 
 * Helper class to pass variables into a function defined by properties  
 */
export function passJavaArgs(properties){
  return Object.entries(properties).map(([name, property]) => {
    return `${name}`
  }).join(',')
}

/*
 * Helper class to convert from async api properties to Java arguments
 */
export function createJavaArgsFromProperties(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `${asyncApiTypeToJavaType(property.type())} ${name}`
  })
}