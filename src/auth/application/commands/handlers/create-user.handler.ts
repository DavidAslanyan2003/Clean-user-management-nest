import { ICreateUserService } from "src/auth/infrastructure/interfaces/create-user-service.interface";
import { CreateUserCommand } from "../create-user.command";
import { CreateUserResultDto } from "../dtos/output/create-user-result.dto";
import { Inject } from "@nestjs/common";
import { CreateUserService } from "src/auth/domain/services/create-user.service";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  public constructor(
    @Inject(CreateUserService) private readonly createUserService: ICreateUserService
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserResultDto> {
    const savedUser = await this.createUserService.createUser(command);

    return savedUser;
  }
}
