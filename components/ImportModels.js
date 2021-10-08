/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */
export function ImportModels({ messages }) {
    const namesList = Object.entries(messages)
      .map(([messageName, message]) => {
        return `import com.ibm.mq.samples.jms.models.${messageName.charAt(0).toUpperCase() + messageName.slice(1)};`
      });
  
    return namesList;
  }
  