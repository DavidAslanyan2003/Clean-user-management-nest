import { ReadUserResultDto } from "../../../application/commands/dtos/output/read-user-result.dto";
import { UserDbModelService } from "../../../domain/services/user-db-model.service";
import { IReadUsersListRepository } from "../../interfaces/read-users-list-repository.interface";


export class ReadUsersListRepositoryHandler implements IReadUsersListRepository {
  private readonly dbModelService: UserDbModelService;

  public constructor(dbModelService: UserDbModelService) {
    this.dbModelService = dbModelService;
  }

  public async read(): Promise<ReadUserResultDto[] | undefined> {
    const users = await this.dbModelService.findAllUsers();

    return users;
  }
}