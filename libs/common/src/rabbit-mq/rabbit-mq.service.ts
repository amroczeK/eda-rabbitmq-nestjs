import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMqService {
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly configService: ConfigService) {}

  async connect() {
    this.connection = await connect(
      this.configService.get<string>('RABBIT_MQ_URI'),
    );
    this.channel = await this.connection.createChannel();
  }

  async publishMessage(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }

  ack(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    channel.ack(originalMessage);
  }

  getOptions(queue: string, noAck = false): RmqOptions {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [this.configService.get<string>('RABBIT_MQ_URI')],
        queue: this.configService.get<string>(`RABBIT_MQ_${queue}_QUEUE`),
        noAck,
        persistent: true,
      },
    };
  }
}
