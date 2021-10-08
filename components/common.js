/*
 * Below you can see how to create reusable chunks/components/helpers.
 * Check the files in the `template` folder to see how to import and use them within a template.
 */

import { Indent, IndentationTypes, withIndendation } from '@asyncapi/generator-react-sdk';

/*
  * Each component has a `childrenContent` property.
  * It is the processed children content of a component into a pure string. You can use it for compositions in your component.
  * 
  * Example:
  * function CustomComponent({ childrenContent }) {
  *   return `some text at the beginning: ${childrenContent}`
  * }
  * 
  * function RootComponent() {
  *   return (
  *     <CustomComponent>
  *       some text at the end.
  *     </CustomComponent>
  *   );
  * }
  * 
  * then output from RootComponent will be `some text at the beginning: some text at the end.`.
  */
export function HTML({ childrenContent }) {
  return `
<!DOCTYPE html>
<html lang="en">
${childrenContent}
</html>
`;
}

export function Class({ childrenContent, name, implementsClass }) {
  let implementsString = "";

  if(implementsClass != null){
    implementsString = `implements ${implementsClass}`
  }
  return `
public class ${name} ${implementsString}{
  ${childrenContent}
}
`;
}

export function ClassHeader({ }) {
return `
  private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");

  public static final String PRODUCER_PUT = "queue";
  public static final String PRODUCER_PUB = "topic";

  private JMSContext context = null;
  private Destination destination = null;
  private JMSProducer producer = null;
  private ConnectionHelper ch = null;`
}

function createJavaArgs(properties){
  return Object.entries(properties).map(([name, property]) => {
      return `${toJavaType(property.type())} ${name}`
  })
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

export function ClassConstructor({ childrenContent, name, properties }) {
  let propertiesString = `String type`;
  

  console.log(`Constructing ${name}, properties`, properties)
  if(properties){
    propertiesString = createJavaArgs(properties);

  }

  return `
  public ${name}(${propertiesString}) {
    ${childrenContent}
  }`
}

export function PackageDeclaration({ path }) {
  return `
package ${path};
  `
}

export function ImportDeclaration({ path }) {
  return `
import ${path};`
}

export function Imports() {
  return `
import java.util.logging.*;
import java.io.Serializable;

import javax.jms.Destination;
import javax.jms.JMSProducer;
import javax.jms.JMSContext;
import javax.jms.Message;
import javax.jms.JMSRuntimeException;
import javax.jms.ObjectMessage;


import com.ibm.mq.samples.jms.ConnectionHelper;
import com.ibm.mq.samples.jms.LoggingHelper;
import com.ibm.mq.samples.jms.Connection;

import com.fasterxml.jackson.databind.ObjectMapper; 
import com.fasterxml.jackson.databind.ObjectWriter; 
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.annotation.JsonView;

  `
}




/*
 * If you need indent content inside template you can use `withIndendation` function or wrap content between `Indent` component.
 * The mentioned helper and component can be imported from `@asyncapi/generator-react-sdk` package.
 * 
 * `withIndendation` function performs action on pure string, but `Indent` can wraps part of template.
 * You can see usage both cases below.
 * 
 * Also you can see how to create components using composition.
 * You can use another component with the given parameters for the given use-case.
 */
export function Head({ title, cssLinks = [] }) {
  const links = cssLinks.map(link => `<link rel="stylesheet" href="${link}">\n`).join('');

  const content = `
<head>
  <meta charset="utf-8">
  <title>${title}</title>
${withIndendation(links, 2, IndentationTypes.SPACES)}
</head>  
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}

export function Body({ childrenContent }) {
  const content = `
<body>
${withIndendation(childrenContent, 2, IndentationTypes.SPACES)}
</body>
`;

  return (
    <Indent size={2} type={IndentationTypes.SPACES}>
      {content}
    </Indent>
  );
}
