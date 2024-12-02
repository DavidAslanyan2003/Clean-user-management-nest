import { ReadUserResultDto } from "../../../application/commands/dtos/output/read-user-result.dto";
import { UserDbModelService } from "../../../domain/services/user-db-model.service";
import { IReadUserRepository } from "../../interfaces/read-user-repository.interface";


export class ReadUserRepositoryHandler implements IReadUserRepository {
  private readonly dbModelService: UserDbModelService;

  public constructor(dbModelService: UserDbModelService) {
    this.dbModelService = dbModelService;
  }

  public async read(userId: string): Promise<ReadUserResultDto | undefined> {
    const savedUser = await this.dbModelService.findUserById(userId);

    if (savedUser) {
      return {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        created_at: savedUser.created_at,
        updated_at: savedUser.updated_at,
        email: savedUser.email,
      }
    }
  }
}