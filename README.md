# :robot: PR-BOT test

The PR-BOT is a tool that will allow us to list pull requests in a Slack channel that are to be reviewed. It will also allow us to trigger actions on Notion, for example to put a ticket in `review`, `done` or to add the link of the PR in the ticket.

## 📦 Prerequisites

You need the following components :

- [Docker and docker-compose](https://docs.docker.com/get-docker): for your local environment
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating): to manage your node versions
- Yarn

## 🚀 Setup environment

### :whale: Docker

Use docker-compose to initiate your local environment:

```
docker-compose up -d
```

This should create containers for **PostgreSQL**. The data for this container is stored locally
in the `.local/data` directory. If you ever need to reset your environment, just delete the container and then the data
directory. To delete the containers, use the command:

```
docker-compose down
```

### :airplane: Development

Make sure to use the correct node version:

```
nvm install
```

Install the required dependencies:

```
yarn install
```

Create database schemas :

```
yarn db:init
yarn db:migrate
```

To run the API with hot-reload :

```
yarn dev
```
