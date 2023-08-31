export interface IRabbitRequest {
  fields: {
    consumerTag: string;
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: {
    headers: object;
  };
  content: {
    type: string;
    data: number[];
  };
}
