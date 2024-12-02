import { UpdateUserResultDto } from "../../application/commands/dtos/output/update-user-result.dto";
import { UpdateUserDto } from "../../application/commands/dtos/input/update-user.dto";

export interface IUpdateUserRepository {
  save(createUserDto: UpdateUserDto): Promise<UpdateUserResultDto>
}
