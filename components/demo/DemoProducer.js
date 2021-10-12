/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/


export function DemoProducer({ asyncApi, message, params }) {

    
    return `
package ${params.package};

import ${params.package}.SingleReleasedProducer;
import ${params.package}.ConnectionHelper;

public class DemoProducer {

    private static final int TIMEOUT = 10000; // 10 Seconnds

    public static void main(String[] args) {
        
        SingleReleasedProducer bp = new SingleReleasedProducer(SingleReleasedProducer.PRODUCER_PUB);
        bp.sendSingle("This I Promise You", "*NSYNC", "No Strings Attached", "Pop", 268);
        bp.close();
    }
}`
}
