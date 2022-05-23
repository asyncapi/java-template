# (c) Copyright IBM Corporation 2021
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM openjdk:11
USER root

RUN apt update &&\
    apt install maven -y

COPY . /data/

# Setup JAVA_HOME -- useful for docker commandline
ENV JAVA_HOME /usr/lib/jvm/java-11-openjdk-amd64/
RUN export JAVA_HOME

# Compile the source code
WORKDIR /data/

RUN mvn compile &&\
    mvn package

# Change this to the entrypoint for your application!
CMD java -cp target/asyncapi-java-generator-0.1.0.jar com.asyncpi.DemoSubscriber;
