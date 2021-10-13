Java Template Tutorial
===

This file provides example commands which can be used to run the Java Template publisher/subscriber model using IBM MQ and a provided YAML file.

## Prerequisites

### Run MQ
You will need a running instance of MQ with a queue named `QM1`, instructions of how to run MQ on a container and create this queue can be found [here](https://developer.ibm.com/tutorials/mq-connect-app-queue-manager-containers/). If you are new to MQ, or want a refresher, you can click [here](https://ibm.biz/learn-mq).
<br></br>

### Create an MQ Topic
To run this tutorial you will need an MQ topic on a queue named `QM1`, instructions on creating an MQ instance with this queue are in the above section. This tutorial provides a YAML file which will attempt to use a topic named `single/released`. To create the topic with the correct permissions:
1. Navigate to the UI of your MQ instance
2. Click 'Manage' on the side menu and navigate to the queue 'QM1'
3. Click the 'Topics' tab at the top of the page
4. Click the 'Create' button
5. Enter `single/released` for both the 'Topic name' and 'Topic string'
6. Click 'Create'
7. Click on `single/released`, the topic you have just created
8. Click 'View configuration' at the top of the page
9. Click the 'Security' tab
10. Click 'Add'
11. Enter the Username `app`
12. Click the 'Admin access' drop down
13. Check the box for 'Permissions to operate privileged commands' and click 'Add'

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
# CHANGE THIS CLONE
Finally, clone the Java Template Repository into your new directory with
```
git clone git@github.ibm.com:InSynQ/template-3.git
```

## Running the Publisher/Subscriber Template
These commands will allow you to run the template publisher/subscriber model using IBM MQ. 
1. From the directory you created in the prerequisites, `./asyncapi-java-template` in the example commands, create the following YAML file by copying the entire below box of code and pressing enter. If using windows, use `type` instead of `cat` at the beginning of the command. Should you wish to use your own YAML file, name it `asyncapi.yaml` and move on to the next step. **Note:** If using your own YAML file, your topic name is the `channel`. You will need to follow the above steps to 'Create an MQ Topic' with your topic name replacing `single/released`
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
        publish: 
          message:
            \$ref: '#/components/messages/single'
            bindings:
              ibmmq:
                type: jms
                description: JMS bytes message
                bindingVersion: 0.1.0
        subscribe:
          message:
            \$ref: '#/components/messages/single'
            bindings:
              ibmmq:
                type: jms
                description: JMS bytes message
                bindingVersion: 0.1.0

      single/rereleased:
        bindings:
          ibmmq:
            topic:
              durablePermitted: true
            bindingVersion: 0.1.0
        subscribe:
          message:
            \$ref: '#/components/messages/single'
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
2. Install the required NodeJS dependencies from the template folder, then return to the `asyncapi-java-tutorial` folder.
```
cd template-3
npm install
cd ..
```
3. Run the AsyncAPI Generator. **Note:** You may need to change the username and password values if you have not followed the IBM MQ tutorial.
    ```
    ag ./asyncapi.yaml ./template-3 -o ./output -p server=production1 -p user=app -p password=passw0rd
    ```
    **Note:** The syntax of the above command is shown below. You do not need to run the below line, it is for informational purposes only.
    ```
    ag [YAML_FILE] [TEMPLATE_DIRECTORY] -o ./output -p server=[NAME_OF_SERVER] -p user=[MQ_USERNAME] -p password=[MQ_PASSWORD]
    ```
4. Navigate to the generated output directory
    ```
    cd output
    ```
5. Install the dependencies required to run this template
    ```
    mvn compile 
    ```
6. Create .jar package using maven
    ```
    mvn package
    ```
7. Run your generated Subscriber
    ```
    java -cp target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoSubscriber
    ```
8. In a seperate terminal, still from the same `output` directory as the previous command, run your generated Publisher   
    ```
    cd ~/asyncapi-java-tutorial/output
    java -cp target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoProducer
    ```

The messages will now be seen to be being sent from the running publisher to the running subscriber, using MQ topics.
