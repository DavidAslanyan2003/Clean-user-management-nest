import { SaveAccessTokenResultDto } from "../../application/commands/dtos/output/save-access-token-result.dto";
import { SaveAccessTokenDto } from "../../application/commands/dtos/input/save-access-token.dto";

export interface ISaveAccessTokenRepository {
  save(saveAccessTokenDto: SaveAccessTokenDto): Promise<SaveAccessTokenResultDto>
}
