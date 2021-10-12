FROM openjdk:11
USER root

RUN apt update &&\
    apt install maven -y


COPY . /data/

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/
RUN export JAVA_HOME



#
# Compile the source code
WORKDIR /data/

RUN mvn compile &&\
    mvn package

# Run our pacakge
CMD java -cp target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoSubscriber;