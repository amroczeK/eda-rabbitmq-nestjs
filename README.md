# About

Simple ordering system demonstrating Event Driven Architecture using NestJs for microservices and RabbitMQ as the message broker for intercommunication between microservices using Topic exchange and RPC patterns.

# Table of contents

<!--ts-->

- [Architecture Diagram](#architecture-diagram)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Docker environment](#docker-environment)
- [Usage](#usage)
<!--te-->

# Architecture Diagram

![Architecture Diagram](/docs/architecture.png)

# Installation

## Prerequisites

- Docker

## Docker environment

Use docker compose to setup the docker environment for the application and other services. The docker compose file contains all the configurations and commands required to build the services, database and seed the dataset into the db.

```bash
# Builds, (re)creates, starts, and attaches to containers for a service in detached mode. Ommit -d if you don't want to run in detached mode.
$ docker compose up -d

# If you want to rebuild
$ docker compose up -d --build
```

# Usage

After starting up the services via docker from the previous step, you can query the system with the following request.

```bash
curl -X POST http://localhost:3000/intermediary/publish-order \
     -H "Content-Type: application/json" \
     -d '{
         "customer_name": "Adrian Test",
         "customer_email": "test@test.com",
         "total_amount": 1,
         "order_items": [
             {
                 "product_name": "Pencil",
                 "quantity": 3,
                 "price": 20
             }
         ]
     }'
```