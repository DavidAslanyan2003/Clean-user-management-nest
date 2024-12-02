import { Email } from "../../domain/value-objects/email.value-object";
import { ICreateUserCommand } from "./interfaces/create-user-command.interface";

export class CreateUserCommand implements ICreateUserCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: Email,
    public readonly password: string
  ) {}
}
