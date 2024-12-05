import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { QueryRunner } from "typeorm";
import { IUpdateUserRepository } from "../../interfaces/update-user-repository.interface";


export class UpdateUserRepositoryHandler implements IUpdateUserRepository {
  public async save(updateUserDto: User, queryRunner: QueryRunner): Promise<CreateUserResultDto> {
    const savedUser = await queryRunner.manager.getRepository(User).save(updateUserDto);

    return savedUser;
  }
}
