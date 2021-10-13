<h5 align="center">
  <br>
  <a href="https://www.asyncapi.org"><img src="https://github.com/asyncapi/parser-nodejs/raw/master/assets/logo.png" alt="AsyncAPI logo" width="200"></a>
  <br>
  AsyncAPI MQ JMS Generator
</h5>


<!-- toc -->

- [Overview](#overview)
- [Technical requirements](#technical-requirements)
- [Supported protocols](#supported-protocols)
- [How to use the template](#how-to-use-the-template)
  - [CLI](#cli)
  - [JMS Template Tutorial](#jms-template-tutorial)
- [Template configuration](#template-configuration)
- [Development](#development)

<!-- tocstop -->

## Overview

This template generates a Java application using Java Messaging Services (JMS) with the [IBM MQ bindings](https://github.com/asyncapi/bindings/tree/master/ibmmq).

## Technical requirements

- 0.50.0 =< [Generator](https://github.com/asyncapi/generator/) < 2.0.0,
- Generator specific [requirements](https://github.com/asyncapi/generator/#requirements)


## Supported protocols

* [IBM MQ](https://en.wikipedia.org/wiki/IBM_MQ)

## How to use the template

This template must be used with the AsyncAPI Generator. You can find all available options [here](https://github.com/asyncapi/generator/).

> You can find a complete tutorial on AsyncAPI Generator using this template [here](https://www.asyncapi.com/docs/tutorials/streetlights). 

### CLI

```bash
# Install the AsyncAPI Generator
npm install -g @asyncapi/generator

# Run generation
ag https://bit.ly/asyncapi ./ -o output -p server=production

```
### JMS Template Tutorial
For complete instructions on generating the Java and subsequently using it to send messages with MQ, please see the template specific [Tutorial](./template/TUTORIAL.md).

## Template configuration

You can configure this template by passing different parameters in the Generator CLI: `-p PARAM1_NAME=PARAM1_VALUE -p PARAM2_NAME=PARAM2_VALUE`

Name | Description | Required | Default
---|---|---|---
`server` | Server must be defined in yaml and selected when using the generator | Yes | -
`user` | User for the IBM MQ instance | No | admin
`password` | Password for the IBM MQ instance | No | passw0rd
`package` | Java package name for generated code | No | com.ibm.mq.samples.jms


## Development

The most straightforward command to use this template is:
```bash
ag https://bit.ly/asyncapi ./ -o output -p server=production
```

For local development, you need different variations of this command. First of all, you need to know about three important CLI flags:
- `--debug` enables the debug mode in Nunjucks engine what makes filters debugging simpler.
- `--watch-template` enables a watcher of changes that you make in the template. It regenerates your template whenever it detects a change.
- `--install` enforces reinstallation of the template.


There are two ways you can work on template development:
- Use global Generator and template from your local sources:
  ```bash
  # assumption is that you run this command from the root of your template
  ag https://bit.ly/asyncapi ./ -o output
  ```
- Use Generator from sources and template also from local sources. This approach enables more debugging options with awesome `console.log` in the Generator sources or even the Parser located in `node_modules` of the Generator:
  ```bash
  # assumption is that you run this command from the root of your template
  # assumption is that generator sources are cloned on the same level as the template
  ../generator/cli.js https://bit.ly/asyncapi ./ -o output
  ```
# Here we should have Docker Info
# Here we should add more information to the Development section
We need to also explain to people in this file where important code aspects live. If someone was using our template where would they add their logic to change things etc.
