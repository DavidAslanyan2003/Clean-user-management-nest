import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../get-user.query";
import { User } from "src/auth/domain/entities/user.entity";
import { Inject } from "@nestjs/common";
import { GetUserByIdRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-user-by-id.repository";
import { IGetUserByIdRepository } from "src/auth/infrastructure/interfaces/read-user-repository.interface";


@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @Inject(GetUserByIdRepositoryQueryHandler) private readonly userRepository: IGetUserByIdRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    return await this.userRepository.read(query.userId);
  }
}
