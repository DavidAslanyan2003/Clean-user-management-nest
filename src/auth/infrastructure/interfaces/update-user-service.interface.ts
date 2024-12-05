import { UpdateUserDto } from "src/auth/application/commands/dtos/input/update-user.dto";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";

export interface IUpdateUserService {
  updateUser(createUserDto: UpdateUserDto): Promise<UpdateUserResultDto>
}
