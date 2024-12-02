import { UpdateUserResultDto } from "../../application/commands/dtos/output/update-user-result.dto";

export interface IDeleteUserRepository {
  save(userId: string): Promise<UpdateUserResultDto>
}
