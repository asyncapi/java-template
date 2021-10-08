/* 
 * Here you can see example of complex operations. 
 * You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
 */

export function ProcessJMSException({ asyncApi }) {
  
    //TODO remove hardcode
    
    return `
    private void processJMSException(JMSException jmsex) {
      logger.warning(jmsex.getMessage());
      Throwable innerException = jmsex.getLinkedException();
      logger.warning("Exception is: " + jmsex);
      if (innerException != null) {
          logger.warning("Inner exception(s):");
      }
      while (innerException != null) {
          logger.warning(innerException.getMessage());
          innerException = innerException.getCause();
      }
      return;
  }
`
}
  