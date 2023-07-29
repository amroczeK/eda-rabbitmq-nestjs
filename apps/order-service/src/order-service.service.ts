import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto, OrderItemDto } from './dtos/order.dto';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.customer_name = orderData.customer_name;
    order.customer_email = orderData.customer_email;
    order.total_amount = orderData.total_amount;

    const orderItems: OrderItem[] = orderData.order_items.map(
      (itemData: OrderItemDto) => {
        const orderItem = new OrderItem();
        orderItem.product_name = itemData.product_name;
        orderItem.quantity = itemData.quantity;
        orderItem.price = itemData.price;
        return orderItem;
      },
    );

    // Save OrderItem entities separately
    const savedOrderItems = await this.orderItemRepository.save(orderItems);

    // Associate the saved OrderItem entities with the Order entity
    order.order_items = savedOrderItems;

    // Save the Order entity
    return this.orderRepository.save(order);
  }
}
