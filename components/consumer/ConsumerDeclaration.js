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



