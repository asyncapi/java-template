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
        return `public ${asyncApiTypeToJavaType(property.type())} ${name};`
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

/*
 * Helper class to create Java constructor input from asyncapi properties
 */
export function createJavaConstructorArgs(properties){
  return Object.entries(properties).map(([name, property]) => {
    return `${asyncApiTypeToDemoValue(property.type())}`
  })
}

/* 
 * Generates an example value from asyncAPI datatype in Java
 */
export function asyncApiTypeToDemoValue(asyncApiType) {
  switch (asyncApiType){
      case ("integer" || "long"):
        return parseInt(Math.random() * 1000);

      case ("float" || "double"):
        return Math.random();

      case ("string" || "binary" || "password"):
        var words = ['ASyncAPI', 'IBM', 'Java', 'React', 'Hackathon', 'Community', 'Open Source', 'MQ', 'JMS', 'Publish', 'Subscribe', 'Topic', 'Demo', 'Example', 'Template', 'Producer', 'Consumer', 'Generator', 'Message', 'Endpoint'];
        return '"' + words[Math.floor(Math.random()*words.length)] + '"';

      case "byte":
        return 0 + (int)(Math.random() * ((127 - 1) + 1))

      case "boolean":
        var words = ['true', 'false'];
        return words[Math.floor(Math.random()*words.length)];

      case ("date" || "dateTime"):
        return (new Date()).toISOString().split('T')[0]
  }
}