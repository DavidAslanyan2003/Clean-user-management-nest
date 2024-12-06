import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetAccessTokenByUserIdQuery } from "../get-access-token-by-user-id.query";
import { ReadAccessTokenByUserIdRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-access-token-by-user-id.repository";
import { IReadAccessTokenByUserIdEmailRepository } from "src/auth/infrastructure/interfaces/read-access-token-by-user-id-repository.interface";
import { AccessToken } from "src/auth/domain/entities/access-token.entity";


@QueryHandler(GetAccessTokenByUserIdQuery)
export class GetAccessTokenByUserIdQueryHandler implements IQueryHandler<GetAccessTokenByUserIdQuery> {
  constructor(
    @Inject(ReadAccessTokenByUserIdRepositoryQueryHandler) private readonly accessTokenRepository: IReadAccessTokenByUserIdEmailRepository,
  ) {}

  async execute(query: GetAccessTokenByUserIdQuery): Promise<AccessToken | null> {
    return await this.accessTokenRepository.read(query.userId);
  }
}
