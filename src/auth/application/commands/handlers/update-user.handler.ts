import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserResultDto } from "../dtos/output/update-user-result.dto";
import { UpdateUserCommand } from "../update-user.command";
import { Inject } from "@nestjs/common";
import { UpdateUserService } from "src/auth/domain/services/update-user.service";
import { IUpdateUserService } from "src/auth/infrastructure/interfaces/update-user-service.interface";


@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand>  {
  public constructor(
    @Inject(UpdateUserService) private readonly updateUserService: IUpdateUserService
  ) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserResultDto> {
    const updatedUser = this.updateUserService.updateUser(command);

    return updatedUser;
  }
}
