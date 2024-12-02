import { User } from "../../../domain/entities/user.entity";
import { ICreateUserRepository } from "../../../infrastructure/interfaces/create-user-repository.interface";
import { IJwtService } from "../../../infrastructure/interfaces/jwt-service.interface";
import { ISaveAccessTokenRepository } from "../../../infrastructure/interfaces/save-access-token-repository.interface";
import { CreateUserCommand } from "../create-user.command";
import { CreateUserResultDto } from "../dtos/output/create-user-result.dto";


export class CreateUserHandler {
  public constructor(
    private readonly userRepository: ICreateUserRepository,
    private readonly saceAccessTokenRepository: ISaveAccessTokenRepository,
    private readonly jwtService: IJwtService
  ) {}

  public async execute(command: CreateUserCommand): Promise<CreateUserResultDto> {

    const user = new User(
      command.firstName,
      command.lastName,
      command.email,
      command.password
    );

    const savedUserResult = await this.userRepository.save(user);

    if (!savedUserResult) {
      throw new Error("Could not save user");
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
      id: savedUserResult.id,
      firstName: savedUserResult.firstName,
      lastName: savedUserResult.lastName,
      email: savedUserResult.email,
      status: savedUserResult.status
    };
  }
}
