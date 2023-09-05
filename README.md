# About

Simple ordering system demonstrating Event Driven Architecture using NestJs for microservices and RabbitMQ as the message broker for intercommunication between microservices using Topic exchange and RPC patterns.

This repository utilizes NestJs monorepo workspaces to share re-usable code and modules across services and the [@golevelup/nestjs-rabbitmq](https://www.npmjs.com/package/@golevelup/nestjs-rabbitmq) module.

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

### Additional considerations

Slight coupling is created due to the RPC Queue between Order and Inventory service, this could be avoided by:

- Order service querying the DB directory to check the Inventory table.
- Push the operation of validating the inventory before inserting an Order onto the DB.
- Reduce operations against the DB to check Inventory table using caching.

All options come with their own caveats, and other considerations need to be made if database is spread across geolocations for resilience.

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
# Placing an order on the frontend after selecting items to order from the displayed inventory.
curl -X POST http://localhost:3000/intermediary/order \
     -H "Content-Type: application/json" \
     -d '{
            "customer_name": "Adrian",
            "customer_email": "test@test.com",
            "order_items": [
                {
                    "id": 1,
                    "product_name": "Laptop Stand",
                    "quantity": 3,
                    "price": 35
                },
                {
                    "id": 2,
                    "product_name": "Mouse Pad",
                    "quantity": 4,
                    "price": 25
                }
            ]
        }'
```

Terminal logs for creating an order:
```
intermediary-service  | [Nest] 523  - 09/05/2023, 3:42:27 AM     LOG [IntermediaryService] Order successfully published.
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingServiceController] handleLog(): shop.order.placed
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingService] {"routing_key":"shop.order.placed","exchange":"shop.topic","payload":{"customer_name":"Adrian","customer_email":"test@test.com","order_items":[{"id":1,"product_name":"Laptop Stand","quantity":3,"price":35},{"id":2,"product_name":"Mouse Pad","quantity":4,"price":25}]},"status":"success","error_message":""}
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingService] Log created with ID: 11
inventory-service     | [Nest] 488  - 09/05/2023, 3:42:27 AM     LOG [InventoryService] Stock is available for items: [{"id":1,"product_name":"Laptop Stand","quantity":3,"price":35},{"id":2,"product_name":"Mouse Pad","quantity":4,"price":25}]
order-service         | [Nest] 210  - 09/05/2023, 3:42:27 AM     LOG [OrderService] Stock available for all items in order: {"customer_name":"Adrian","customer_email":"test@test.com","order_items":[{"id":1,"product_name":"Laptop Stand","quantity":3,"price":35},{"id":2,"product_name":"Mouse Pad","quantity":4,"price":25}]}
order-service         | [Nest] 210  - 09/05/2023, 3:42:27 AM     LOG [OrderService] Saved order items: [{"product_name":"Laptop Stand","quantity":3,"price":35,"id":29},{"product_name":"Mouse Pad","quantity":4,"price":25,"id":30}]
order-service         | [Nest] 210  - 09/05/2023, 3:42:27 AM     LOG [OrderService] Order created: {"customer_name":"Adrian","customer_email":"test@test.com","total_items":7,"total_value":205,"order_items":[{"product_name":"Laptop Stand","quantity":3,"price":35,"id":29},{"product_name":"Mouse Pad","quantity":4,"price":25,"id":30}],"id":15,"created_at":"2023-09-05T03:42:27.687Z","updated_at":"2023-09-05T03:42:27.687Z"}.
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingServiceController] handleLog(): shop.inventory.decrement.quantity
inventory-service     | [Nest] 488  - 09/05/2023, 3:42:27 AM     LOG [InventoryServiceController] handleInventory(): shop.inventory.decrement.quantity
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingService] {"routing_key":"shop.inventory.decrement.quantity","exchange":"shop.topic","payload":[{"id":1,"product_name":"Laptop Stand","quantity":3,"price":35},{"id":2,"product_name":"Mouse Pad","quantity":4,"price":25}],"status":"success","error_message":""}
logging-service       | [Nest] 723  - 09/05/2023, 3:42:27 AM     LOG [LoggingService] Log created with ID: 12
inventory-service     | [Nest] 488  - 09/05/2023, 3:42:27 AM     LOG [InventoryService] Updated stock quantity for item: {"id":1,"product_name":"Laptop","quantity":129,"price":"1000","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-05T03:42:27.802Z"}
inventory-service     | [Nest] 488  - 09/05/2023, 3:42:27 AM     LOG [InventoryService] Updated stock quantity for item: {"id":2,"product_name":"Phone","quantity":172,"price":"500","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-05T03:42:27.802Z"}
```


```bash
# Retrieving all of the inventory items. Data could be sent to the frontend using Webhooks.
curl -X GET http://localhost:3000/intermediary/inventory \
     -H "Content-Type: application/json"
```

Terminal logs for listing inventory:
```
inventory-service     | [Nest] 488  - 09/05/2023, 3:41:29 AM     LOG [InventoryServiceController] handleInventory(): shop.inventory.list
logging-service       | [Nest] 723  - 09/05/2023, 3:41:29 AM     LOG [LoggingServiceController] handleLog(): shop.inventory.list
logging-service       | [Nest] 723  - 09/05/2023, 3:41:29 AM     LOG [LoggingService] {"routing_key":"shop.inventory.list","exchange":"shop.topic","payload":{},"status":"success","error_message":""}
inventory-service     | [Nest] 488  - 09/05/2023, 3:41:29 AM     LOG [InventoryService] Inventory list: [{"id":1,"product_name":"Laptop","quantity":"132","price":"1000","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-05T01:41:10.805Z"},{"id":2,"product_name":"Phone","quantity":"176","price":"500","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-05T01:41:10.805Z"},{"id":3,"product_name":"Keyboard","quantity":"100","price":"50","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"},{"id":4,"product_name":"Mouse","quantity":"100","price":"45","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"},{"id":5,"product_name":"Laptop Stand","quantity":"150","price":"35","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"},{"id":6,"product_name":"Mouse Pad","quantity":"200","price":"25","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"},{"id":7,"product_name":"Phone Case","quantity":"172","price":"30","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"},{"id":8,"product_name":"KVM Switch","quantity":"96","price":"175","created_at":"2023-09-04T04:13:21.165Z","updated_at":"2023-09-04T04:13:21.165Z"}]
logging-service       | [Nest] 723  - 09/05/2023, 3:41:29 AM     LOG [LoggingService] Log created with ID: 10
```
