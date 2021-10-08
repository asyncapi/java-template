export function Connection(){
    return `
package com.ibm.mq.samples.jms;

public class Connection {
    public String HOST;
    public int PORT;
    public String CHANNEL;
    public String QMGR;
    public String APP_USER;
    public String APP_PASSWORD;
    public String QUEUE_NAME;
    public String TOPIC_NAME;
    public String CIPHER_SUITE;

    public Connection(String HOST, int PORT, String CHANNEL, 
                        String QMGR, String APP_USER, String APP_PASSWORD, 
                        String QUEUE_NAME, String TOPIC_NAME, String CIPHER_SUITE) {
        this.HOST = HOST;
        this.PORT = PORT;
        this.CHANNEL = CHANNEL;
        this.QMGR = QMGR;
        this.APP_USER = APP_USER;
        this.APP_PASSWORD = APP_PASSWORD;
        this.QUEUE_NAME = QUEUE_NAME;
        this.TOPIC_NAME = TOPIC_NAME;
        this.CIPHER_SUITE = CIPHER_SUITE;
    }
}
`
}