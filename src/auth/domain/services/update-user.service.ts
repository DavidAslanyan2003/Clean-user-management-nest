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
import { UpdateUserDto } from "src/auth/application/commands/dtos/input/update-user.dto";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";
import { IUpdateUserService } from "src/auth/infrastructure/interfaces/update-user-service.interface";
import { IReadUserRepository } from "src/auth/infrastructure/interfaces/read-user-repository.interface";
import { ReadUserRepositoryQueryHandler } from "src/auth/infrastructure/repositories/queries/read-user.repository";
import { UpdateUserRepositoryHandler } from "src/auth/infrastructure/repositories/commands/update-user.repository";
import { IUpdateUserRepository } from "src/auth/infrastructure/interfaces/update-user-repository.interface";


export class UpdateUserService implements IUpdateUserService {
  public constructor(
    @InjectRepository(User)
    private readonly userQueryRunnerRepository: Repository<User>,
    @Inject(UpdateUserRepositoryHandler) private readonly userRepository: IUpdateUserRepository,
    @Inject(SaveAccessTokenRepositoryHandler) private readonly saceAccessTokenRepository: ISaveAccessTokenRepository,
    @Inject(JwtService) private readonly jwtService: IJwtService,
    @Inject(ReadUserRepositoryQueryHandler) private readonly getUserRepository: IReadUserRepository,
  ) {}
  
  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getUserRepository.read(updateUserDto.id, queryRunner);

      if (!user) {
        throw new Error("Could not find the user");
      }

      user.firstName = updateUserDto.firstName;
      user.lastName = updateUserDto.lastName;
      user.email = updateUserDto.email;
      user.password = updateUserDto.password;
  
      const updatedUserResult = await this.userRepository.save(user, queryRunner);
  
      if (!updatedUserResult) {
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
        id: updatedUserResult.id,
        firstName: updatedUserResult.firstName,
        lastName: updatedUserResult.lastName,
        email: updatedUserResult.email,
        status: updatedUserResult.status
      };
    } catch(error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  }
}