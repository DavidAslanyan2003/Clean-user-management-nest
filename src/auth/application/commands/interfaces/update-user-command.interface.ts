import { Email } from "../../../domain/value-objects/email.value-object";

export interface IUpdateUserCommand {
  firstName: string,
  lastName: string,
  email: Email,
  password: string
}
