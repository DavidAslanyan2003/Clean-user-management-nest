import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { IReadAccessTokenByUserIdEmailRepository } from "../../interfaces/read-access-token-by-user-id-repository.interface";
import { AccessToken } from "src/auth/domain/entities/access-token.entity";


export class ReadAccessTokenByUserIdRepositoryQueryHandler implements IReadAccessTokenByUserIdEmailRepository {
  public constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>,
  ) {}
  
  public async read(userId: string): Promise<AccessToken | undefined> {
    const savedToken = await this.accessTokenRepository.findOne({
      where: { userId: userId }
    });

   return savedToken;
  }
}