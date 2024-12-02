import { Email } from "../../../../domain/value-objects/email.value-object";
import { UserStatus } from "../../../../presentation/enums/user-status.enum";

export interface UpdateUserResultDto {
  id: string;
  firstName: string;
  lastName: string;
  email: Email;
  status?: UserStatus
}
