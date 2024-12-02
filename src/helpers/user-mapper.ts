import { ReadUserResultDto } from "src/auth/application/commands/dtos/output/read-user-result.dto";
import { User } from "src/auth/domain/entities/user.entity";


export const mapUserData = (userData: User): ReadUserResultDto => {
  const mappedData = {
    id: userData.id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
    email: userData.email.value
  };

  return mappedData;
}
