import { IDeleteUserCommand } from "./interfaces/delete-user-command.interface";

export class DeleteUserCommand implements IDeleteUserCommand {
  constructor(
    public readonly userId: string,
  ) {}
}