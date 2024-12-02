import { UpdateUserResultDto } from "../../../application/commands/dtos/output/update-user-result.dto";
import { User } from "../../../domain/entities/user.entity";
import { UserDbModelService } from "../../../domain/services/user-db-model.service";
import { IUpdateUserRepository } from "../../interfaces/update-user-repository.interface";



export class UpdateUserRepositoryHandler implements IUpdateUserRepository {
  private readonly dbModelService: UserDbModelService;

  public constructor(dbModelService: UserDbModelService) {
    this.dbModelService = dbModelService;
  }

  public async save(updateUserDto: User): Promise<UpdateUserResultDto> {
    const updatedUser = await this.dbModelService.saveUser(updateUserDto);

    return {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    }
  }
}