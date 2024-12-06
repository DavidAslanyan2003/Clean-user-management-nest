import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUserResultDto } from "../dtos/output/update-user-result.dto";
import { UpdateUserCommand } from "../update-user.command";
import { Inject } from "@nestjs/common";
import { UpdateUserRepositoryHandler } from "src/auth/infrastructure/repositories/commands/update-user.repository";
import { IUpdateUserRepository } from "src/auth/infrastructure/interfaces/update-user-repository.interface";


@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand>  {
  public constructor(
    @Inject(UpdateUserRepositoryHandler) private readonly userRepository: IUpdateUserRepository,
  ) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserResultDto> {
    const updatedUser = this.userRepository.save(command);

    return updatedUser;
  }
}
