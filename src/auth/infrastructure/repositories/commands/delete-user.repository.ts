import { UpdateUserResultDto } from "../../../application/commands/dtos/output/update-user-result.dto";
import { UserDbModelService } from "../../../domain/services/user-db-model.service";
import { Email } from "../../../domain/value-objects/email.value-object";
import { UserStatus } from "../../../presentation/enums/user-status.enum";
import { IDeleteUserRepository } from "../../interfaces/delete-user-repository.interface";


export class DeleteUserRepositoryHandler implements IDeleteUserRepository {
  private readonly dbModelService: UserDbModelService;

  public constructor(dbModelService: UserDbModelService) {
    this.dbModelService = dbModelService;
  }

  public async save(userId: string): Promise<UpdateUserResultDto> {
    const updatedUserDto = {
      id: userId,
      firstName: "David",
      lastName: "Aslanyan",
      created_at: new Date,
      updated_at: null,
      password: 'david123',
      status: UserStatus.DELETED,
      email: Email.create('david@gmail.com')
    };

    const deletedUser = await this.dbModelService.saveUser(updatedUserDto);

    return {
      id: deletedUser.id,
      firstName: deletedUser.firstName,
      lastName: deletedUser.lastName,
      email: deletedUser.email,
      status: deletedUser.status
    }
  }
}