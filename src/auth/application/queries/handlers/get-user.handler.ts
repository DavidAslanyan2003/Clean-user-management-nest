import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetUserByIdQuery } from "../get-user.query";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/domain/entities/user.entity";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { ReadUserRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-user.repository";
import { IReadUserRepository } from "src/auth/infrastructure/interfaces/read-user-repository.interface";
import { ReadUserResultDto } from "../../commands/dtos/output/read-user-result.dto";


@QueryHandler(GetUserByIdQuery)
export class GetUserByIdQueryHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userQueryRunnerRepository: Repository<User>,
    @Inject(ReadUserRepositoryQueryHandler) private readonly userRepository: IReadUserRepository,
  ) {}

  async execute(query: GetUserByIdQuery): Promise<ReadUserResultDto| null> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    return await this.userRepository.read(query.userId, queryRunner);
  }
}
