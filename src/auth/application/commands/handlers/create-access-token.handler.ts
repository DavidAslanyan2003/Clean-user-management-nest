import { Inject } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAccessTokenCommand } from "../create-access-token.command";
import { SaveAccessTokenRepositoryHandler } from "src/auth/infrastructure/repositories/commands/save-access-token.repository";
import { ISaveAccessTokenRepository } from "src/auth/infrastructure/interfaces/save-access-token-repository.interface";

@CommandHandler(CreateAccessTokenCommand)
export class CreateAccesssTokenCommandHandler implements ICommandHandler<CreateAccessTokenCommand> {
  public constructor(
    @Inject(SaveAccessTokenRepositoryHandler) private readonly saveAccessTokenRepository: ISaveAccessTokenRepository,
  ) {}

  public async execute(command: CreateAccessTokenCommand): Promise<any> {
    const savedUser = await this.saveAccessTokenRepository.save(command);

    return savedUser;
  }
}
