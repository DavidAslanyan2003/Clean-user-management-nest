import { UpdateUserDto } from "src/auth/application/commands/dtos/input/update-user.dto";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";

export interface IDeleteUserService {
  deleteUser(userId: string): Promise<UpdateUserResultDto>
}
