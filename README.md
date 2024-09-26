# fastify-esbuild-mongodb

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Opinionated boilerplate to build a Fastify app and Mongodb with better DX.

---

<img align="center" src="https://i.ibb.co/ZTVLZSn/fastify-esbuild-mongodb-land-image.png" alt="fastify-esbuild-mongodb-land-image" border="0">

## Introduction

This is a fork of `fastify-esbuild` , a great work from [David Peng](https://github.com/davipon) Thank's David.

This code is born after reading the articles on [Better Backend DX: Fastify + ESBuild = ⚡️](https://davipon.hashnode.dev/better-backend-dx-fastify-esbuild)

In addition this project have these features :

- Complete MongoDB collections management with [node-mongo](https://ship.paralect.com/docs/packages/node-mongo) package to simplify Mongodb usage.
  It is used the official Node.js driver (**<u>Mongoose is not used</u>**)
- Full test suite using [Vitest](https://vitest.dev/)
- Configuration using dotenv environments
- CRUD complete for the `boards` sample collection.

Feel to free enhancements, proposal, (errors).

---

### Original article

<https://davipon.hashnode.dev/better-backend-dx-fastify-esbuild>)

## Features

- Use `@fastify/autoload` for filesystem-based routes & plugins.
- Use [`esbuild-kit/tsx`](https://github.com/esbuild-kit/tsx) to reduce feedback loop during devlopment.
- Use `esbuild` to bundle production code.
- Use Conventional Commits & SemVer standards, e.g. `commitlint`, `commitizen`, `standard-version`.
- Use `eslint`, `prettier`, `lint-staged`.
- Use `husky` git hooks helper to run formatter & linter.

---

## How to start?

```zsh
# Install dependencies
pnpm i

# Activate git hooks
pnpm prepare

# Start development
pnpm dev

# Build production code
pnpm build

# Run production code
pnpm start
```

## Avatar dimension

The suggested dimension for avatar is 60x60 pixels

## keycloak Authorization

For authorize an API request is necessary to check if **Bearer token** passed in header has the right to
execute the action

### Enforcer

Is the preHandler *function* inside **core** folder used by each route that has to be protected. If the [enforce] function finish
without reply and error or status code mean that the request can be executed. Otherwise it will be reply the error and status code and
the request will be aborted

### Configuration object

Inside route definition is necessary to define a configuration object with the following shape

```ts
config: { resource: 'resourceName', scope: '[read-write-delete]' },
```

The object properties must be the same with the one defined inside keycloak console administration under **Client -> Authservice -> Authorization -> resources
![alt text](./public/static/img/AuthorizationResources.png)

### preHandler

Is a fastify hook that will be executed before route handler
