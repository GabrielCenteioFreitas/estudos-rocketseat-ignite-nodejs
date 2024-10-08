import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/use-cases/resource-not-found-error";
import { Injectable } from "@nestjs/common";
import { OrderDetails } from "../../enterprise/entities/value-objects/order-details";
import { OrdersRepository } from "../repositories/orders-repository";

export interface GetOrderUseCaseRequest {
  orderId: string;
}

export type GetOrderUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: OrderDetails,
  }
>

@Injectable()
export class GetOrderUseCase {
  constructor(
    private ordersRepository: OrdersRepository,
  ) {}

  async execute({
    orderId,
  }: GetOrderUseCaseRequest): Promise<GetOrderUseCaseResponse> {
    const order = await this.ordersRepository.findDetailsById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}