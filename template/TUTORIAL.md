# {{ asyncapi.info().title() }}

{{ asyncapi.info().description() | safe }}

This file provides example commands which can be used to run this template publisher/subsriber model using IBM MQ and a provided YAML file.

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
1. Create the following YAML file. If using windows, use `type` instead of `cat`
    ```
    cat <<EOT >> asyncapi.yaml
    asyncapi: 2.0.0
    info:
    title: Record Label Service
    version: 1.0.0
    description: This service is in charge of processing music
    servers:
    production1:
        url: ibmmq://localhost:1414/QM1/DEV.APP.SVRCONN
        protocol: ibmmq-secure
        description: Production Instance 1
    channels:
    single/released:
        bindings:
        ibmmq:
            topic:
            durablePermitted: true
            bindingVersion: 0.1.0
        subscribe:
        message:
            $ref: '#/components/messages/single'
            bindings:
            ibmmq:
                type: jms
                description: JMS bytes message
                bindingVersion: 0.1.0
    components:
    messages:
        single:
        payload:
            type: object
            properties:
            title:
                type: string
                description: Song title
            artist:
                type: string
                description: Song artist
            album:
                type: string
                description: Song album
            genre:
                type: string
                description: Primary song genre
            length:
                type: integer
                description: Track length in seconds
    EOT
    ```
    # CHANGE THE TEMPLATE NAME
2. Run the AsyncAPI Generator
    ```
    ag ./asyncapi.yaml ./java-jm-mq-template -o ./output -p server=production1 -p user=[MQ_USERNAME] -p password=[MQ_PASSWORD]
    ```
3. Navigate to the generated output directory
    ```
    cd output
    ```
3. Install the dependencies required to run this template
    ```
    mvn compile 
    ```
4. Create .jar package using maven
    ```
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