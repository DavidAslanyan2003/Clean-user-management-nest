import { Email } from "../../../../domain/value-objects/email.value-object";


export interface UpdateUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: Email;
  password: string;
}
