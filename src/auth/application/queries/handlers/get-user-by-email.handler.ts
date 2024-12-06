import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../get-user.query";
import { User } from "src/auth/domain/entities/user.entity";
import { Inject } from "@nestjs/common";
import { GetUserByEmailQuery } from "../get-user-by-email.query";
import { ReadUserByEmailRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-user-by-email.repository";
import { IReadUserByEmailRepository } from "src/auth/infrastructure/interfaces/read-user-by-email-repository.interface";


@QueryHandler(GetUserByIdQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    @Inject(ReadUserByEmailRepositoryQueryHandler) private readonly userRepository: IReadUserByEmailRepository,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    return await this.userRepository.read(query.email);
  }
}
