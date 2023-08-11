import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto, OrderItemDto } from './dtos/order.dto';
import { OrderItem } from './entities/order-item.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { INVENTORY_SERVICE } from './constants';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(INVENTORY_SERVICE)
    private inventoryClient: ClientProxy,
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<void> {
    try {
      this.logger.log(`Order received: ${JSON.stringify(orderData)}`);
      const stockAvailable = await this.validateStockForOrder(orderData);

      if (!stockAvailable) throw 'Order has unavailable stock.';

      this.logger.log(`Order created successfully. ID: 123`);

      // const order = new Order();
      // order.customer_name = orderData.customer_name;
      // order.customer_email = orderData.customer_email;
      // order.total_amount = orderData.total_amount;

      // const orderItems: OrderItem[] = orderData.order_items.map(
      //   (itemData: OrderItemDto) => {
      //     const orderItem = new OrderItem();
      //     orderItem.product_name = itemData.product_name;
      //     orderItem.quantity = itemData.quantity;
      //     orderItem.price = itemData.price;
      //     return orderItem;
      //   },
      // );

      // // Save OrderItem entities separately
      // const savedOrderItems = await this.orderItemRepository.save(orderItems);

      // // Associate the saved OrderItem entities with the Order entity
      // order.order_items = savedOrderItems;

      // // Save the Order entity
      // return this.orderRepository.save(order);
    } catch (error) {
      this.logger.error(`Error creating order: ${error}`);
    }
  }

  private async validateStockForOrder(
    orderData: CreateOrderDto,
  ): Promise<boolean> {
    const pattern = { cmd: 'check_inventory' };
    const payload = orderData;

    try {
      const stockIsValid = await lastValueFrom(
        this.inventoryClient.send<boolean>(pattern, payload),
      );
      return stockIsValid;
    } catch (e) {
      throw new RpcException('Error checking inventory');
    }
  }

  async cancelOrder(): Promise<void> {
    // DO STUFF
  }

  async orderFailed(): Promise<void> {
    // DO STUFF
  }
}
