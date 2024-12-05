import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { ICreateUserRepository } from "../../interfaces/create-user-repository.interface";
import { QueryRunner } from "typeorm";


export class CreateUserRepositoryHandler implements ICreateUserRepository {
  public async save(createUserDto: User, queryRunner: QueryRunner): Promise<CreateUserResultDto> {
    const savedUser = await queryRunner.manager.getRepository(User).save(createUserDto);

    return savedUser;
  }
}