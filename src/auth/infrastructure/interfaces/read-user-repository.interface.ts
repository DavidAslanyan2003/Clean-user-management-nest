import { User } from "src/auth/domain/entities/user.entity";

export interface IGetUserByIdRepository {
  read(userId: string): Promise<User | undefined>
}
