import { InjectRepository } from "@nestjs/typeorm";
import { SaveAccessTokenDto } from "../../../application/commands/dtos/input/save-access-token.dto";
import { ISaveAccessTokenRepository } from "../../interfaces/save-access-token-repository.interface";
import { Repository } from "typeorm";
import { AccessToken } from "src/auth/domain/entities/access-token.entity";


export class SaveAccessTokenRepositoryHandler implements ISaveAccessTokenRepository {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: Repository<AccessToken>
  ) {}

  public async save(saveAccessTokenDto: SaveAccessTokenDto): Promise<any> {
    const { userId, token } = saveAccessTokenDto;
    const savedToken = await this.accessTokenRepository.findOne({where: { userId: userId }});

    if (savedToken) {
      savedToken.token = token;
      await this.accessTokenRepository.save(savedToken);

      return savedToken;
    }

    const savedAccessToken = await this.accessTokenRepository.save(saveAccessTokenDto);

    return savedAccessToken;
  }
}