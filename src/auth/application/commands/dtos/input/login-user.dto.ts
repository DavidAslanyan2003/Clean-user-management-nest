import { Email } from "../../../../domain/value-objects/email.value-object";

export interface LoginUserDto {
  email: Email;
  password: string;
}
