/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/


export function DemoProducer({ asyncApi, message, params, messageName, className, constructorArgs }) {
    return `
package ${params.package};

import ${params.package}.${className}Producer;
import ${params.package}.ConnectionHelper;
import ${params.package}.models.${messageName};

public class DemoProducer {
    public static void main(String[] args) {
        ${messageName} message = new ${messageName}(${constructorArgs});
        SingleReleasedProducer producer = new ${className}Producer();
        producer.send(message);
        producer.close();
    }
}`
}
