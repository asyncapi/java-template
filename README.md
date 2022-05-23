[![AsyncAPI Java Generator](./assets/logo.png)](https://www.asyncapi.com)


<!-- toc -->

- [Overview](#overview)
- [Technical requirements](#technical-requirements)
- [Supported protocols](#supported-protocols)
- [How to use the template](#how-to-use-the-template)
  - [CLI](#cli)
  - [Template Tutorial](#template-tutorial)
- [Template configuration](#template-configuration)
- [Environment variables](#environment-variables)
- [Development](#development)
- [Key Files](#key-files)
  - [Generator Code](#generator-code)
  - [Generated Code](#generated-code)
- [Container Information](#container-information)
- [Future Enhancements](#future-enhancements)
- [Contributors ✨](#contributors-)

<!-- tocstop -->

## Overview

This template generates Java application code based from an AsyncAPI document.

Implementations are provided for the following protocols:
* `ibmmq` - generating Java JMS code (utilising features from the [IBM MQ AsyncAPI bindings](https://github.com/asyncapi/bindings/tree/master/ibmmq))
* `kafka` - generating Java code  (utilising features from the [Apache Kafka AsyncAPI bindings](https://github.com/asyncapi/bindings/tree/master/kafka))

## Technical requirements

- 0.50.0 =< [Generator](https://github.com/asyncapi/generator/) < 2.0.0,
- Generator specific [requirements](https://github.com/asyncapi/generator/#requirements)


## Supported protocols

* ibmmq
    * This is implemented using the JMS API with the correct jars, in this case ibmmq was chosen. The use of JMS allows allows the template to be extensible to other providers by providing the correct jars at the Maven stage.
* kafka
    * This is implemented using the official client library from the Apache Kafka project.

## How to use the template

This template must be used with the AsyncAPI Generator. You can find all available options [here](https://github.com/asyncapi/generator/).

### CLI

```sh
# Install the AsyncAPI Generator
npm install -g @asyncapi/generator

# Run generation
ag https://ibm.biz/mq-asyncapi-yml-sample @asyncapi/java-template -o output -p server=production

```
### Template Tutorial
For complete instructions on generating the Java and subsequently using it to send messages, please see the relevant tutorial:
- [ibmmq tutorial](./tutorials/IBMMQ.md)
- [kafka tutorial](./tutorials/KAFKA.md)


## Template configuration

You can configure this template by passing different parameters in the Generator CLI: `-p PARAM1_NAME=PARAM1_VALUE -p PARAM2_NAME=PARAM2_VALUE`

Name | Description | Required | Default
---|---|---|---
`server` | Server must be defined in yaml and selected when using the generator | Yes | -
`user` | User for the server to generate code for. This can also be provided as an environment variable (see below) | No | app
`password` | Password for the server to generate code for. This can also be provided as an environment variable (see below) | No | passw0rd
`package` | Java package name for generated code | No | com.asyncapi
`mqTopicPrefix` | MQ topic prefix. Used for ibmmq protocols. Default will work with dev MQ instance | No | dev//
`asyncapiFileDir` | Custom output location of the AsyncAPI file that you provided as an input | No | The root of the output directory


## Environment variables

Credentials can be provided as environment variables if preferred. If set, these credentials will override those set with the template parameters.

Name | Description
---|---
`APP_USER` | Overrides `user` template parameter
`APP_PASSWORD` | Overrides `password` template parameter

All credentials are stored in `env.json` in the output directory, so they can be updated at any time without needing to run the generator or recompile the Java.

## Development

The most straightforward command to use this template is:
```sh
ag https://ibm.biz/mq-asyncapi-yml-sample @asyncapi/java-template -o output -p server=production
```

For local development, you need different variations of this command. First of all, you need to know about three important CLI flags:
- `--debug` enables the debug mode in Nunjucks engine what makes filters debugging simpler.
- `--watch-template` enables a watcher of changes that you make in the template. It regenerates your template whenever it detects a change.
- `--install` enforces reinstallation of the template.


There are two ways you can work on template development:
- Use global Generator and template from your local sources:
  ```sh
  # assumption is that you run this command from the root of your template
  ag https://ibm.biz/mq-asyncapi-yml-sample @asyncapi/java-template -o output -p server=production
  ```
- Use Generator from sources and template also from local sources. This approach enables more debugging options with awesome `console.log` in the Generator sources or even the Parser located in `node_modules` of the Generator:
  ```sh
  # assumption is that you run this command from the root of your template
  # assumption is that generator sources are cloned on the same level as the template
  ../generator/cli.js https://ibm.biz/mq-asyncapi-yml-sample @asyncapi/java-template -o output -p server=production
  ```

## Key Files
As a developer, you may want to make changes to how the generator operates. This non-exhaustive list aims to show the files you will likely need to change most.


### Generator Code

Path | Description
---|---
template/index.js | Entry point for the application
components/Common.js | Common/helper functions used across the generator
utils/* | Contains all filters
components/* | Contains reusable components

### Generated Code
***Note:***  Files in the output directory are generated using the ag command, detailed in the above section.

Path | Description
---|---
output/env.json | Used for setting environmental variables such as username and password
output/com/ibm/mq/samples/jms/PubSubBase.java | The base used for generated publishers and subscribers


## Container Information
To run the generated Java project in a Docker container, use the commands as below:

1. Build the image
   ```
    docker build -t [PACKAGE_NAME]:[VERSION] .
   ```

2. Run the image in detached mode
   ```
    docker run -d [PACKAGE_NAME]:[VERSION]
   ```

For further information including network setup, please see the [tutorial](./tutorials).

## Future Enhancements
* General enhancements
    * Add support for multiple messages per channel (ofMany)
    * Support for MQTT
    * Support for other protocols
* `ibmmq` protocol enhancements
    * Add support for TLS connections
    * Add support for more JMS Types alongside JMS Text
    * Offer Java event listener support for consumers

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/dan-r"><img src="https://avatars.githubusercontent.com/u/1384852?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dan Raper</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=dan-r" title="Code">💻</a> <a href="https://github.com/asyncapi/java-template/commits?author=dan-r" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/JEFFLUFC"><img src="https://avatars.githubusercontent.com/u/54025356?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tom Jefferson</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=JEFFLUFC" title="Code">💻</a> <a href="#tutorial-JEFFLUFC" title="Tutorials">✅</a> <a href="https://github.com/asyncapi/java-template/commits?author=JEFFLUFC" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/lewis-relph"><img src="https://avatars.githubusercontent.com/u/91530893?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lewis Relph</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=lewis-relph" title="Code">💻</a> <a href="https://github.com/asyncapi/java-template/commits?author=lewis-relph" title="Documentation">📖</a> <a href="https://github.com/asyncapi/java-template/commits?author=lewis-relph" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/KieranM1999"><img src="https://avatars.githubusercontent.com/u/45017928?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kieran Murphy</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=KieranM1999" title="Code">💻</a> <a href="https://github.com/asyncapi/java-template/commits?author=KieranM1999" title="Documentation">📖</a> <a href="https://github.com/asyncapi/java-template/commits?author=KieranM1999" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/AGurlhosur"><img src="https://avatars.githubusercontent.com/u/91530186?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Akshaya Gurlhosur</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=AGurlhosur" title="Documentation">📖</a> <a href="https://github.com/asyncapi/java-template/commits?author=AGurlhosur" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/dalelane"><img src="https://avatars.githubusercontent.com/u/1444788?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Dale Lane</b></sub></a><br /><a href="https://github.com/asyncapi/java-template/commits?author=dalelane" title="Code">💻</a> <a href="https://github.com/asyncapi/java-template/commits?author=dalelane" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
