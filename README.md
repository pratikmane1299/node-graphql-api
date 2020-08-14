# node-graphql-api

A graphql api with [**node**](https://nodejs.org/en/), [**apollo-graphql**](https://www.apollographql.com/), [**express**](https://expressjs.com/) and [**mongodb**](https://www.mongodb.com/).

## Requirements

- **Mongodb** : https://docs.mongodb.com/manual/installation/

## Getting Started

**Clone the repo**

```bash
$ git clone https://github.com/pratikmane1299/node-graphql-api.git
$ cd deno-rest-api
```

**Install dependencies**

```bash
$ npm install
```

**Setup environment vaiables**

Copy .env.example to .env and add your own values

**Running the project**

```bash
$ npm start
```

## Running using Docker

Install Docker and run the below command

```bash
$ docker-compose up
```

### Using Docker Toolbox

Steps to use localhost instead of ip address.

**In VirtualBox:**

1. Select "default" machine and click on Setting.
2. Navigate to Network > Adapter 1 > Advanced > Port Forwarding.
3. Click "+" to add new rule.
4. Set Host Port <code><Port as in .env></code> and Guest Port to <code><Port as in .env></code> and leave Host IP & Guest IP empty.

Do the above step for both mongo database and the graphql server.
