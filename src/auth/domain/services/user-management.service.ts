import { CreateUserDto } from "src/auth/application/commands/dtos/input/create-user.dto";
import { CreateUserResultDto } from "src/auth/application/commands/dtos/output/create-user-result.dto";
import { IUserManagementService } from "src/auth/infrastructure/interfaces/create-user-service.interface";
import { User } from "../entities/user.entity";
import { IJwtService } from "src/auth/infrastructure/interfaces/jwt-service.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Inject } from "@nestjs/common";
import { JwtService } from "src/auth/infrastructure/services/jwt.service";
import { CreateUserCommandHandler } from '../../application/commands/handlers/create-user.handler';
import { UserModel } from "../models/user.model";
import { UpdateUserDto } from "src/auth/application/commands/dtos/input/update-user.dto";
import { UpdateUserResultDto } from "src/auth/application/commands/dtos/output/update-user-result.dto";
import { CreateAccesssTokenCommandHandler } from "src/auth/application/commands/handlers/create-access-token.handler";
import { UpdateUserCommandHandler } from "src/auth/application/commands/handlers/update-user.handler";
import { GetUserByIdQueryHandler } from "src/auth/application/queries/handlers/get-user.handler";
import { UserStatus } from "src/auth/presentation/enums/user-status.enum";
import { LoginUserDto } from "src/auth/application/commands/dtos/input/login-user.dto";
import { GetUserByEmailQueryHandler } from "src/auth/application/queries/handlers/get-user-by-email.handler";
import { LoginUserResultDto } from "src/auth/application/commands/dtos/output/login-user-result.dto";
import { GetAccessTokenByUserIdQueryHandler } from "src/auth/application/queries/handlers/get-access-token-by-user-id.handler";


export class UserManagementService implements IUserManagementService {
  public constructor(
    @InjectRepository(User)
    private readonly userQueryRunnerRepository: Repository<User>,
    @Inject(JwtService) private readonly jwtService: IJwtService,
    private readonly getUserByIdCommandHandler: GetUserByIdQueryHandler,
    private readonly getUserByEmailCommandHandler: GetUserByEmailQueryHandler,
    private readonly createUserCommandHandler: CreateUserCommandHandler,
    private readonly updateUserCommandHandler: UpdateUserCommandHandler,
    private readonly createAccessTokenCommandHandler: CreateAccesssTokenCommandHandler,
    private readonly getAccessTokenByUserIdCommandHandler: GetAccessTokenByUserIdQueryHandler
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
  
      const savedUserResult = await this.createUserCommandHandler.execute(user);
  
      if (!savedUserResult) {
        throw new Error("Could not save user");
      };
  
      const accessToken = this.jwtService.generateToken(user.id);

      if (!accessToken) {
        throw new Error('Faied to generate token');
      }

      const savedAccessToken = await this.createAccessTokenCommandHandler.execute({
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
 
    try {
      const user = await this.getUserByIdCommandHandler.execute({userId: updateUserDto.id});

      if (!user) {
        throw new Error("Could not find the user");
      }

      user.firstName = updateUserDto.firstName;
      user.lastName = updateUserDto.lastName;
      user.email = updateUserDto.email;
      user.password = updateUserDto.password;
  
      const updatedUserResult = await this.updateUserCommandHandler.execute(user);
  
      if (!updatedUserResult) {
        throw new Error("Could not save user");
      };
  
      const accessToken = this.jwtService.generateToken(user.id);

      if (!accessToken) {
        throw new Error('Faied to generate token');
      }

      const savedAccessToken = await this.createAccessTokenCommandHandler.execute({
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

  async deleteUser(userId: string): Promise<UpdateUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getUserByIdCommandHandler.execute({userId: userId});

      if (!user) {
        throw new Error("Could not find the user");
      }
      
      user.status = UserStatus.DELETED;

      const savedUserResult = await this.updateUserCommandHandler.execute(user);
  
      if (!savedUserResult) {
        throw new Error("Could not save user");
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

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginUserResultDto> {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getUserByEmailCommandHandler.execute({ email: loginUserDto.email });

      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new Error("Invalid credentials");
      }

      if (user.password !== loginUserDto.password) {
        throw new Error("Invalid credentials");
      }

      const newAccessToken = this.jwtService.generateToken(user.id);
      const savedAccessToken = await this.createAccessTokenCommandHandler.execute({
        userId: user.id,
        token: newAccessToken
      });

      if (!savedAccessToken) {
        throw new Error("Could not save access token");
      };

      await queryRunner.commitTransaction();
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        token: savedAccessToken
      };
    } catch(error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async logoutUser(userId: string) {
    const queryRunner = this.userQueryRunnerRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.getUserByIdCommandHandler.execute({userId: userId});
      if (!user) {
        throw new Error("Could not find the user");
      }

      user.status = UserStatus.ACTIVE;
  
      await this.createAccessTokenCommandHandler.execute({
        userId: user.id,
        token: ""
      });

      await queryRunner.commitTransaction();
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        status: user.status,
        token: ""
      };
    } catch(error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    
  }
}
