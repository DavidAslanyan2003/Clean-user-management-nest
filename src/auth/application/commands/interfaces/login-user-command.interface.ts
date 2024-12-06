import { Email } from "../../../domain/value-objects/email.value-object";

export interface ILoginUserCommand {
  email: Email,
  password: string
}
