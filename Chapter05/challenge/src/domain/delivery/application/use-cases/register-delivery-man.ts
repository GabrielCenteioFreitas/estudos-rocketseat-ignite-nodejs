import { Either, left, right } from "@/core/either";
import { CpfAlreadyInUseError } from "@/core/errors/use-cases/cpf-already-in-use-error";
import { Injectable } from "@nestjs/common";
import { DeliveryMan } from "../../enterprise/entities/delivery-man";
import { CPF } from "../../enterprise/entities/value-objects/cpf";
import { Location } from "../../enterprise/entities/value-objects/location";
import { HashGenerator } from "../cryptography/hash-generator";
import { DeliveryMenRepository } from "../repositories/delivery-men-repository";

export interface RegisterDeliveryManUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  location: {
    longitude: number;
    latitude: number;
  }
}

export type RegisterDeliveryManUseCaseResponse = Either<
  CpfAlreadyInUseError,
  {
    deliveryMan: DeliveryMan;
  }
>

@Injectable()
export class RegisterDeliveryManUseCase {
  constructor(
    private deliveryMenRepository: DeliveryMenRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    location,
  }: RegisterDeliveryManUseCaseRequest): Promise<RegisterDeliveryManUseCaseResponse> {
    const deliveryManWithSameCPF = await this.deliveryMenRepository.findByCPF(cpf)

    if (deliveryManWithSameCPF) {
      return left(new CpfAlreadyInUseError(cpf))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryMan = DeliveryMan.create({
      name,
      cpf: CPF.create(cpf),
      password: hashedPassword,
      location: Location.create(location),
    })

    await this.deliveryMenRepository.create(deliveryMan)

    return right({
      deliveryMan,
    })
  }
}