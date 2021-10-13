/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/


export function DemoSubscriber({ asyncApi, message, params, className }) {

    
    return `
package ${params.package};

import ${params.package}.${className}Subscriber;
import ${params.package}.ConnectionHelper;

public class DemoSubscriber {

    private static final int TIMEOUT = 10000; // 10 Seconnds

    public static void main(String[] args) {
        
        ${className}Subscriber bc = new ${className}Subscriber();
        
        bc.receive(TIMEOUT);
        bc.close();
    }
}`
}
