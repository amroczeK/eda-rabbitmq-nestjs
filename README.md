# About

Simple ordering system demonstrating Event Driven Architecture using NestJs for microservices and RabbitMQ as the message broker for intercommunication between microservices using Topic exchange and RPC patterns.

# Table of contents

<!--ts-->

- [Architecture Diagram](#architecture-diagram)
- [Installation](#installation)
  - [Prerequisites](#prerequisites)
  - [Start applications](#start-applications)
  - [Run migrations](#run-migrations)
- [Usage](#usage)
<!--te-->

# Architecture Diagram

![Architecture Diagram](/docs/architecture.png)

# Installation

## Prerequisites

- Docker

## Start services in Docker environment

Use docker compose to setup the docker environment for the application and other services. The docker compose file contains all the configurations and commands required to build the services, database and seed the dataset into the db.

```bash
# Builds, (re)creates, starts, and attaches to containers for a service in detached mode. Ommit -d if you don't want to run in detached mode.
$ docker compose up -d

# If you want to rebuild
$ docker compose up -d --build
```

## Run migrations

To pre-populate the inventory table with data run the migrations after the services have started.

```bash
# Get the container id for inventory service
$ docker ps
CONTAINER ID   IMAGE                                      COMMAND                  CREATED          STATUS                    PORTS                                                                                                         NAMES
47a7811a7046   eda-rabbitmq-nestjs-order-service          "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes                                                                                                                           order-service
413736db7d85   eda-rabbitmq-nestjs-inventory-service      "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes                                                                                                                           inventory-service
bfba0a0e3152   eda-rabbitmq-nestjs-intermediary-service   "docker-entrypoint.s…"   48 minutes ago   Up 46 minutes             0.0.0.0:3000->3000/tcp                                                                                        intermediary-service
7a6051d761fd   postgres:latest                            "docker-entrypoint.s…"   48 minutes ago   Up 47 minutes             0.0.0.0:5432->5432/tcp                                                                                        shopdb
b3cc7b9cf65c   rabbitmq:3.12-management                   "docker-entrypoint.s…"   48 minutes ago   Up 47 minutes (healthy)   4369/tcp, 5671/tcp, 0.0.0.0:5672->5672/tcp, 15671/tcp, 15691-15692/tcp, 25672/tcp, 0.0.0.0:15672->15672/tcp   rabbitmq

# Open a terminal (e.g. a bash shell) to the container
$ docker exec -it <container_id_or_name> /bin/bash

# Run the migration script
$ npm run typeorm:run-migrations
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