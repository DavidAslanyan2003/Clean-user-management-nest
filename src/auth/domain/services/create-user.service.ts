import { CreateUserDto } from "src/auth/application/commands/dtos/input/create-user.dto";
import { CreateUserResultDto } from "src/auth/application/commands/dtos/output/create-user-result.dto";
import { ICreateUserService } from "src/auth/infrastructure/interfaces/create-user-service.interface";
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
import { UserModel } from "../models/user.model";


export class CreateUserService implements ICreateUserService {
  public constructor(
    @InjectRepository(User)
    private readonly userQueryRunnerRepository: Repository<User>,
    @Inject(CreateUserRepositoryHandler) private readonly userRepository: ICreateUserRepository,
    @Inject(SaveAccessTokenRepositoryHandler) private readonly saceAccessTokenRepository: ISaveAccessTokenRepository,
    @Inject(JwtService) private readonly jwtService: IJwtService,
  ) {}
  
  async createUser(createUserDto: CreateUserDto): Promise<CreateUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserModel(
        createUserDto.firstName,
        createUserDto.lastName,
        createUserDto.email,
        createUserDto.password
      );
  
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