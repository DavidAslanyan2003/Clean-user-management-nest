import { Email } from "../../../domain/value-objects/email.value-object";

export interface ICreateUserCommand {
  firstName: string,
  lastName: string,
  email: Email,
  password: string
}
