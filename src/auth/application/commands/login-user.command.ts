import { Email } from "../../domain/value-objects/email.value-object";
import { ILoginUserCommand } from "./interfaces/login-user-command.interface";

export class LoginUserCommand implements ILoginUserCommand {
  constructor(
    public readonly email: Email,
    public readonly password: string
  ) {}
}
