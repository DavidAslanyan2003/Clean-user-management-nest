import { ReadUserResultDto } from "../../application/commands/dtos/output/read-user-result.dto";

export interface IReadUsersListRepository {
  read(): Promise<ReadUserResultDto[] | undefined>
}
