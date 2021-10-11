FROM openjdk:11
USER root
#
COPY . /data/

RUN apt update &&\
    apt install maven -y

#
# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/
RUN export JAVA_HOME



#
# Compile the source code
RUN cd /data/ && \
    mvn compile &&\
    mvn package


# Run our pacakge
ENTRYPOINT [ "java -cp /data/target/asyncapi-mq-jms-generator-0.1.0.jar com.ibm.mq.samples.jms.DemoSubscriber" ]