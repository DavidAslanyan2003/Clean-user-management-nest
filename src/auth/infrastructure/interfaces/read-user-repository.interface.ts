import { ReadUserResultDto } from "../../application/commands/dtos/output/read-user-result.dto";

export interface IReadUserRepository {
  read(userId: string): Promise<ReadUserResultDto | undefined>
}
