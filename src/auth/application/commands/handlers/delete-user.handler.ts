import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "../delete-user.command";
import { IDeleteUserService } from "src/auth/infrastructure/interfaces/delete-user-service.interface";
import { DeleteUserService } from "src/auth/domain/services/delete-user.service";
import { Inject } from "@nestjs/common";


@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler implements ICommandHandler<DeleteUserCommand>{
  public constructor(
    @Inject(DeleteUserService) private readonly deleteUserService: IDeleteUserService
  ) {}

  public async execute(command: DeleteUserCommand) {
    const deletedUser = this.deleteUserService.deleteUser(command.userId);

    return deletedUser;
  }
}
