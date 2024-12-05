import { QueryRunner } from "typeorm";
import { UpdateUserResultDto } from "../../application/commands/dtos/output/update-user-result.dto";

export interface IDeleteUserRepository {
  save(userId: string, queryRunner: QueryRunner): Promise<UpdateUserResultDto>
}
