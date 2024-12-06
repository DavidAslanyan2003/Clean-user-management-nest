import { Email } from "../../domain/value-objects/email.value-object";
import { IUpdateUserCommand } from "./interfaces/update-user-command.interface copy";

export class UpdateUserCommand implements IUpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: Email,
    public readonly password: string
  ) {}
}
