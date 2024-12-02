import { IDeleteUserRepository } from "../../../infrastructure/interfaces/delete-user-repository.interface";
import { DeleteUserCommand } from "../delete-user.command";
import { CreateUserResultDto } from "../dtos/output/create-user-result.dto";


export class DeleteUserHandler {
  public constructor(
    private readonly userRepository: IDeleteUserRepository,
  ) {}

  public async execute(command: DeleteUserCommand): Promise<CreateUserResultDto> {

    const savedUserResult = await this.userRepository.save(command.userId);

    if (!savedUserResult) {
      throw new Error("Could not delete the user");
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
