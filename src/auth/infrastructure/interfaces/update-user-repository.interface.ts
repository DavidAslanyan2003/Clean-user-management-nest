import { UpdateUserResultDto } from "../../application/commands/dtos/output/update-user-result.dto";
import { UpdateUserDto } from "../../application/commands/dtos/input/update-user.dto";
import { QueryRunner } from "typeorm";

export interface IUpdateUserRepository {
  save(updateUserDto: UpdateUserDto): Promise<UpdateUserResultDto>
}
