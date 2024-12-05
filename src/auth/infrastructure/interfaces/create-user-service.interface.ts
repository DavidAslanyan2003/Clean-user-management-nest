import { CreateUserResultDto } from "../../application/commands/dtos/output/create-user-result.dto";
import { CreateUserDto } from "../../application/commands/dtos/input/create-user.dto";

export interface ICreateUserService {
  createUser(createUserDto: CreateUserDto): Promise<CreateUserResultDto>
}
