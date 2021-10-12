# {{ asyncapi.info().title() }}

{{ asyncapi.info().description() | safe }}

## Prerequisites
### Install Maven
For instructions on installing maven for your operating system, please see the [Apache Maven site](https://maven.apache.org/install.html).
<br></br>

### Run MQ
You will need a running instance of MQ, instructions of how to run MQ on a Container can be found [here](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-containers/).
<br></br>

### Install the AsyncAPI Generator
This template must be used with the AsyncAPI Generator, if you have not already installed the Generator, run:
```
npm install -g @asyncapi/generator
```

## Running the Publisher/Subscriber Template
These commands will allow you to run the template publisher/subscriber model using IBM MQ. 
1. Run the AsyncAPI Generator
    ```
    ag [YOUR_YAML_FILE] [TEMPLATE_DIRECTORY] -o ./output -p server=[NAME_OF_SERVER_FROM_YAML] -p user=[MQ_USERNAME] -p password=[MQ_PASSWORD]
    ```
2. Navigate to the generated output directory
    ```
    cd output
    ```
3. Install the dependencies required to run this template
    ```
    mvn compile 
    ```
4. Create .jar package using maven
    ```sh
    mvn package
    ```
5. Run your generated Subscriber
    ```
    java -cp target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoSubscriber
    ```
6. In a seperate terminal, still from the same `output` directory as the previous command, run your generated Publisher   
    ```sh
    java -cp target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoProducer
    ```

The messages will now be seen to be being sent from the running publisher to the running subscriber, using MQ topics.


# TODO
We need to also explain to people in this file where important code aspects live. If someone was using our template where would they add their logic to change things etc.