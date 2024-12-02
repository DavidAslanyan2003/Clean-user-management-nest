import { User } from "../../../domain/entities/user.entity";
import { IJwtService } from "../../../infrastructure/interfaces/jwt-service.interface";
import { ISaveAccessTokenRepository } from "../../../infrastructure/interfaces/save-access-token-repository.interface";
import { IUpdateUserRepository } from "../../../infrastructure/interfaces/update-user-repository.interface";
import { UpdateUserResultDto } from "../dtos/output/update-user-result.dto";
import { UpdateUserCommand } from "../update-user.command";


export class UpdateUserHandler {
  public constructor(
    private readonly userRepository: IUpdateUserRepository,
    private readonly saceAccessTokenRepository: ISaveAccessTokenRepository,
    private readonly jwtService: IJwtService
  ) {}

  public async execute(command: UpdateUserCommand): Promise<UpdateUserResultDto> {

    const user = new User(
      command.firstName,
      command.lastName,
      command.email,
      command.password
    );

    const updatedUserResult = await this.userRepository.save(user);

    if (!updatedUserResult) {
      throw new Error("Could not update the user");
    };

    const accessToken = this.jwtService.generateToken(user);
    const savedAccessToken = await this.saceAccessTokenRepository.save({
      userId: user.id,
      token: accessToken
    });

    if (!savedAccessToken) {
      throw new Error("Could not save access token");
    };

    return {
      id: updatedUserResult.id,
      firstName: updatedUserResult.firstName,
      lastName: updatedUserResult.lastName,
      email: updatedUserResult.email
    };
  }
}
