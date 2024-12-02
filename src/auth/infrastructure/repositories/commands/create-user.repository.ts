import { CreateUserResultDto } from "../../../application/commands/dtos/output/create-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { UserDbModelService } from "../../../domain/services/user-db-model.service";
import { ICreateUserRepository } from "../../interfaces/create-user-repository.interface";


export class CreateUserRepositoryHandler implements ICreateUserRepository {
  private readonly dbModelService: UserDbModelService;

  public constructor(dbModelService: UserDbModelService) {
    this.dbModelService = dbModelService;
  }

  public async save(createUserDto: User): Promise<CreateUserResultDto> {
    const savedUser = await this.dbModelService.saveUser(createUserDto);

    return {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      status: savedUser.status
    }
  }
}