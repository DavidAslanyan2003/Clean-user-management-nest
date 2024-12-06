import { ICreateAccessTokenCommand } from "./interfaces/create-access-token-command.interface";

export class CreateAccessTokenCommand implements ICreateAccessTokenCommand {
  constructor(
    public readonly userId: string,
    public readonly token: string
  ) {}
}
