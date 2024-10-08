import { Order } from "../../enterprise/entities/order";
import { OrderDetails } from "../../enterprise/entities/value-objects/order-details";

export interface FindManyNearbyParams {
  latitude: number;
  longitude: number;
}

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>;
  abstract save(order: Order): Promise<void>;
  abstract delete(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract findDetailsById(id: string): Promise<OrderDetails | null>;
  abstract findManyByDeliveryManId(deliveryManId: string): Promise<Order[]>;
  abstract findManyNearby(params: FindManyNearbyParams): Promise<Order[]>;
}