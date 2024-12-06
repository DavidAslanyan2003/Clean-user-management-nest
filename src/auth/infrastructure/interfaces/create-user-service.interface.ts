import { CreateUserResultDto } from "../../application/commands/dtos/output/create-user-result.dto";
import { CreateUserDto } from "../../application/commands/dtos/input/create-user.dto";
import { UpdateUserDto } from "src/auth/application/commands/dtos/input/update-user.dto";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";
import { LoginUserDto } from "src/auth/application/commands/dtos/input/login-user.dto";
import { LoginUserResultDto } from "src/auth/application/commands/dtos/output/login-user-result.dto";

export interface IUserManagementService {
  createUser(createUserDto: CreateUserDto): Promise<CreateUserResultDto>,
  updateUser(createUserDto: UpdateUserDto): Promise<UpdateUserResultDto>,
  deleteUser(userId: string): Promise<UpdateUserResultDto>,
  loginUser(loginUserDto: LoginUserDto): Promise<LoginUserResultDto>,
  logoutUser(userId: string)
}
