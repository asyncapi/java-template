/*
* (c) Copyright IBM Corporation 2021
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* 
* Here you can see example of complex operations. 
* You can actually do whatever you want. It is important that the value returned from the function must be a string or a component.
*/

export function DemoSubscriber({ params, className }) {
  return `
import ${params.package}.${className}Subscriber;
import ${params.package}.ConnectionHelper;

public class DemoSubscriber {

    private static final int TIMEOUT = 10000; // 10 Seconnds

    public static void main(String[] args) {
        // Create a subscriber instance to connect to the server
        ${className}Subscriber consumer = new ${className}Subscriber();
        
        // Receive updates for this queue indefinitely
        consumer.receive(TIMEOUT);

        // Close the connection
        consumer.close();
    }
}`;
}