import { QueryRunner } from "typeorm";
import { IReadUserRepository } from "../../interfaces/read-user-repository.interface";
import { User } from "src/auth/domain/entities/user.entity";


export class ReadUserRepositoryQueryHandler implements IReadUserRepository {
  public async read(userId: string, queryRunner: QueryRunner): Promise<User | undefined> {
    const savedUser = await queryRunner.manager.getRepository(User).findOne({
      where: { id: userId }
    });

   return savedUser;
  }
}