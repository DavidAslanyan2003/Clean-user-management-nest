import { Email } from "../../../../domain/value-objects/email.value-object";

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: Email;
  password: string;
}
