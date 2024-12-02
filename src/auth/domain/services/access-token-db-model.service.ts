import { SaveAccessTokenDto } from "../../application/commands/dtos/input/save-access-token.dto";
import { AccessToken } from "../entities/access-token.entity";


export class AccessTokenDbModelService {
  private readonly accessTokens: AccessToken[] = [];

  public async saveAccessToken(accessToken: SaveAccessTokenDto) {
    // this.accessTokens.push(accessToken);
    // return accessToken;
  };

  public async getAccessTokenByUserId(id: string): Promise<AccessToken | undefined> {
    return this.accessTokens.find(token => token.userId === id);
  };
}
