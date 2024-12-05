import { QueryRunner } from "typeorm";
import { User } from "src/auth/domain/entities/user.entity";

export interface IReadUserRepository {
  read(userId: string, queryRunner: QueryRunner): Promise<User | undefined>
}
