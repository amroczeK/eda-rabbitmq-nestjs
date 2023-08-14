import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMqService {
  private connection: Connection;
  private channel: Channel;
  private readonly exchangeName = 'shop.topic';
  private readonly exchangeType = 'topic';
  private readonly logger = new Logger(RabbitMqService.name);
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000; // 5 seconds

  constructor(private readonly configService: ConfigService) {
    this.init();
  }

  private async init() {
    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        this.logger.log(
          `${this.configService.get<string>(
            'SERVICE_NAME',
          )} is trying to establish a connection to RabbitMQ`,
        );
        await this.connect();
        this.connection.on('close', () => {
          this.logger.error(
            'RabbitMQ connection closed! Attempting to reconnect...',
          );
          setTimeout(() => this.init(), this.retryDelay);
        });
        this.connection.on('error', (err) => {
          this.logger.error(`RabbitMQ error: ${err.message}`);
        });
        break;
      } catch (err) {
        this.logger.error(
          `Failed to connect to RabbitMQ. Retrying in ${
            this.retryDelay / 1000
          } seconds...`,
        );
        await new Promise((res) => setTimeout(res, this.retryDelay));
        retries += 1;
      }
    }
    if (retries === this.maxRetries) {
      this.logger.error('Max retries reached. Could not connect to RabbitMQ.');
    }
  }

  private async connect() {
    this.connection = await connect(
      this.configService.get<string>('RABBIT_MQ_URI'),
    );
    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(this.exchangeName, this.exchangeType, {
      durable: true,
    });
    const inventoryQueue = 'inventory';
    const orderQueue = 'order';
    await this.channel.assertQueue(inventoryQueue, { durable: true });
    await this.channel.assertQueue(orderQueue, { durable: true });
    this.channel.bindQueue(
      inventoryQueue,
      this.exchangeName,
      'shop.inventory.*',
    );
    this.channel.bindQueue(
      inventoryQueue,
      this.exchangeName,
      'shop.order.created',
    );
    this.channel.bindQueue(orderQueue, this.exchangeName, 'shop.order.placed');
  }

  async publishMessage(routingKey: string, message: string) {
    try {
      this.logger.log(`RMQ Publishing to ${routingKey} with ${message}`);
      this.channel.publish(this.exchangeName, routingKey, Buffer.from(message));
    } catch (err) {
      this.logger.error(`Failed to publish message: ${err.message}`);
    }
  }

  async close() {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (err) {
      this.logger.error(`Error while closing the connection: ${err.message}`);
    }
  }

  ack(context: RmqContext) {
    try {
      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);
    } catch (err) {
      this.logger.error(`Failed to acknowledge message: ${err.message}`);
    }
  }

  getOptions(queue: string, noAck = true): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
