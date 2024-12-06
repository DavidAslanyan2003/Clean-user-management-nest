import { UserStatus } from "src/auth/presentation/enums/user-status.enum";
import { Email } from "../../../../domain/value-objects/email.value-object";

export interface LoginUserResultDto {
  id: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  email: Email;
  token: string;
}
