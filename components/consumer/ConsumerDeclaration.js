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

export function ConsumerDeclaration({name}) {
return `
  private static final Logger logger = Logger.getLogger("com.ibm.mq.samples.jms");

  public static final String CONSUMER_SUB = "topic";
  public static final String CONSUMER_GET = "queue";

  private JMSContext context = null;
  private Destination destination = null;
  private JMSConsumer consumer = null;
  private ConnectionHelper ch = null;
`
}



