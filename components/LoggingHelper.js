export function LoggingHelper(){
    return `   
    import java.util.logging.*;
    
    public class LoggingHelper {
        private static final Level LOGLEVEL = Level.ALL;
    
        public static void init(Logger logger) {
            Logger defaultLogger = Logger.getLogger("");
            Handler[] handlers = defaultLogger.getHandlers();
            if (handlers != null && handlers.length > 0) {
                defaultLogger.removeHandler(handlers[0]);
            }
    
            Handler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(LOGLEVEL);
            logger.addHandler(consoleHandler);
    
            logger.setLevel(LOGLEVEL);
            logger.finest("Logging initialised");
        }
    }
`
}