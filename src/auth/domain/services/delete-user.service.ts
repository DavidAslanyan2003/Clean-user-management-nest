import { User } from "../entities/user.entity";
import { ICreateUserRepository } from "src/auth/infrastructure/interfaces/create-user-repository.interface";
import { ISaveAccessTokenRepository } from "src/auth/infrastructure/interfaces/save-access-token-repository.interface";
import { IJwtService } from "src/auth/infrastructure/interfaces/jwt-service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { CreateUserRepositoryHandler } from "src/auth/infrastructure/repositories/commands/create-user.repository";
import { SaveAccessTokenRepositoryHandler } from "src/auth/infrastructure/repositories/commands/save-access-token.repository";
import { JwtService } from "src/auth/infrastructure/services/jwt.service";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";
import { IDeleteUserService } from "src/auth/infrastructure/interfaces/delete-user-service.interface";
import { GetUserByIdQueryHandler } from "src/auth/application/queries/handlers/get-user.handler";
import { IReadUserRepository } from "src/auth/infrastructure/interfaces/read-user-repository.interface";
import { UserStatus } from "src/auth/presentation/enums/user-status.enum";
import { ReadUserRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-user.repository";
import { DeleteUserRepositoryHandler } from "src/auth/infrastructure/repositories/commands/delete-user.repository";
import { IUpdateUserRepository } from "src/auth/infrastructure/interfaces/update-user-repository.interface";


export class DeleteUserService implements IDeleteUserService {
  public constructor(
    @InjectRepository(User)
    private readonly userQueryRunnerRepository: Repository<User>,
    @Inject(DeleteUserRepositoryHandler) private readonly userRepository: IUpdateUserRepository,
    @Inject(ReadUserRepositoryQueryHandler) private readonly getUserRepository: IReadUserRepository,
    @Inject(SaveAccessTokenRepositoryHandler) private readonly saceAccessTokenRepository: ISaveAccessTokenRepository,
    @Inject(JwtService) private readonly jwtService: IJwtService,
  ) {}
  
  async deleteUser(userId: string): Promise<UpdateUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getUserRepository.read(userId, queryRunner);

      if (!user) {
        throw new Error("Could not find the user");
      }
      
      user.status = UserStatus.DELETED;

      const savedUserResult = await this.userRepository.save(user, queryRunner);
  
      if (!savedUserResult) {
        throw new Error("Could not save user");
      };
  
      const accessToken = this.jwtService.generateToken(user.id);

      if (!accessToken) {
        throw new Error('Faied to generate token');
      }

      const savedAccessToken = await this.saceAccessTokenRepository.save({
        userId: user.id,
        token: accessToken
      });
  
      if (!savedAccessToken) {
        throw new Error("Could not save access token");
      };
  
      await queryRunner.commitTransaction();
      return {
        id: savedUserResult.id,
        firstName: savedUserResult.firstName,
        lastName: savedUserResult.lastName,
        email: savedUserResult.email,
        status: savedUserResult.status
      };
    } catch(error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  }
}