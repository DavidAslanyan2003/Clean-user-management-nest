import { CreateUserResultDto } from "../../application/commands/dtos/output/create-user-result.dto";
import { CreateUserDto } from "../../application/commands/dtos/input/create-user.dto";
import { QueryRunner } from "typeorm";

export interface ICreateUserRepository {
  save(createUserDto: CreateUserDto): Promise<CreateUserResultDto>
}
