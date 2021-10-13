/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/


export function DemoProducer({ asyncApi, message, params, messageName, className }) {
    
    
    return `
package ${params.package};

import ${params.package}.${className}Producer;
import ${params.package}.ConnectionHelper;
import ${params.package}.Models.${messageName};

public class DemoProducer {

    private static final int TIMEOUT = 10000; // 10 Seconnds

    public static void main(String[] args) {
        ${messageName} message = new ${messageName}();
        SingleReleasedProducer bp = new ${className}Producer();
        bp.send(message);
        bp.close();
    }
}`
}
