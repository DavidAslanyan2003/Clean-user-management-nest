import { Email } from "../../../../domain/value-objects/email.value-object";


export interface UpdateUserDto {
  firstName: string;
  lastName: string;
  email: Email;
  password: string;
}
