Java Template Tutorial
===

This file provides example commands which can be used to run the Java Template publisher/subscriber model using Apache Kafka and a provided YAML file.

## Prerequisites

### Run Apache Kafka
You will need a running Apache Kafka cluster. Instructions for how to run Kafka can be found [here](https://kafka.apache.org/quickstart) If you are new to Kafka, or want a refresher, you can click [here](https://kafka.apache.org/intro).
<br></br>

### Install Maven
For instructions on installing maven for your operating system, please see the [Apache Maven site](https://maven.apache.org/install.html).
<br></br>

### Install the AsyncAPI Generator
This template must be used with the [AsyncAPI Generator](https://github.com/asyncapi/generator/), if you have not already installed the Generator, run:
```
npm install -g @asyncapi/generator
```
### Set up your Working Environment
To work with the Java Template, you will need to clone the repository. Navigate to a directory where you would like to store the code, for example run
```
mkdir ~/asyncapi-java-tutorial
```
You will then need to enter the directory you have just created, for example with
```
cd ~/asyncapi-java-tutorial
```

## Running the Publisher/Subscriber Template
These commands will allow you to run the Java Template publisher/subscriber model using IBM MQ.
1. Run the AsyncAPI Generator.
    ```
    ag https://ibm.biz/kafka-asyncapi-yml-sample @asyncapi/java-template -o ./output -p server=production
    ```
    **Note:** The syntax of the above command is shown below. You do not need to run the below line, it is for informational purposes only.
    ```
    ag [YAML_FILE] [TEMPLATE_DIRECTORY] -o ./output -p server=[NAME_OF_SERVER] -p user=[KAFKA_USERNAME] -p password=[KAFKA_PASSWORD]
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
    ```
    mvn package
    ```
5. Run your generated Subscriber
    ```
    java -cp target/asyncapi-java-generator-0.1.0.jar com.asyncapi.DemoSubscriber
    ```
6. In a separate terminal, navigate to the `output` directory above and run your generated Publisher
    ```
    cd ~/asyncapi-java-tutorial/output
    java -cp target/asyncapi-java-generator-0.1.0.jar com.asyncapi.DemoProducer
    ```

The messages will now be seen to be being sent from the running publisher to the running subscriber, using Kafka topics. Your output from your subscriber should look something like
```
Oct 14, 2021 9:53:23 AM com.asyncapi.SingleReleasedSubscriber receive
INFO: Received message: {
  “title” : “Hackathon”,
  “artist” : “Java”,
  “album” : “JMS”,
  “genre” : “Java”,
  “length” : 166
}
TYPE: com.asyncapi.models.Single
```

## Running with Docker
To deploy a dockerised instance of this project;

1. Build the image
   ```
    docker build -t [PACKAGE_NAME]:[VERSION] .
   ```

2. Run the image in detached mode
   ```
    docker run -d [PACKAGE_NAME]:[VERSION]
   ```

Please note; The default `Dockerfile` included in output will only run `DemoSubscriber.java`. This will need to be replaced with the entrypoint to your application.

### Networking
Docker networking needs to be properly configured in order to allow your project to connect to a Kafka cluster.

If Kafka is also running in a docker container
1. Create a docker network
   ```
    docker network create exampleKafkaNetwork
   ```
2. Attach the docker network to your Kafka container
   ```
    docker network connect exampleKafkaNetwork
   ```
3. Update your env.json server hostname to match the container name for Kafka. To find the name run
   ```
   docker ps
   ```
