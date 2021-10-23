#!/bin/bash
cd "$(dirname "$0")"
rm -rf /tmp/javatemplatekafka
./node_modules/.bin/ag \
    ./test/mocks/kafka-example.yml \
    mq-asyncapi-java-template \
    -o /tmp/javatemplatekafka \
    -p server=production \
    -p user=kafka-app -p password=passw0rd \
    -p package=com.asyncapi.kafka
