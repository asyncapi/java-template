#!/bin/bash
cd "$(dirname "$0")"
rm -rf /tmp/javatemplatemq
./node_modules/.bin/ag \
    ./test/mocks/single-channel.yml \
    mq-asyncapi-java-template \
    -o /tmp/javatemplatemq \
    -p server=production \
    -p user=mq-app -p password=passw0rd
