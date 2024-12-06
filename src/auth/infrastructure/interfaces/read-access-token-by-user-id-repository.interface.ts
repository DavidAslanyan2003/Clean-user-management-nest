import { AccessToken } from "src/auth/domain/entities/access-token.entity";

export interface IReadAccessTokenByUserIdEmailRepository {
  read(userId: string): Promise<AccessToken | undefined>
}
