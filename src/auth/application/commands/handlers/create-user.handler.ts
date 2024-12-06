import { IUserManagementService } from "src/auth/infrastructure/interfaces/create-user-service.interface";
import { CreateUserCommand } from "../create-user.command";
import { CreateUserResultDto } from "../dtos/output/create-user-result.dto";
import { Inject } from "@nestjs/common";
import { UserManagementService } from "src/auth/domain/services/user-management.service";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserRepositoryHandler } from "src/auth/infrastructure/repositories/commands/create-user.repository";
import { ICreateUserRepository } from "src/auth/infrastructure/interfaces/create-user-repository.interface";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  public constructor(
    @Inject(CreateUserRepositoryHandler) private readonly userRepository: ICreateUserRepository,
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserResultDto> {
    const savedUser = await this.userRepository.save(command);

    return savedUser;
  }
}
