/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/


export function DemoSubscriber({ asyncApi, message }) {

    
    return `
package com.ibm.mq.samples.jms;

import com.ibm.mq.samples.jms.SingleReleasedSubscriber;
import com.ibm.mq.samples.jms.ConnectionHelper;

public class DemoSubscriber {

    private static final int TIMEOUT = 10000; // 10 Seconnds

    public static void main(String[] args) {
        
        SingleReleasedSubscriber bc = new SingleReleasedSubscriber(SingleReleasedSubscriber.CONSUMER_SUB);
        
        bc.receive(TIMEOUT);
        bc.close();
    }
}`
}
