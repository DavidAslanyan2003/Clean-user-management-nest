import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../application/commands/dtos/input/create-user.dto';
import { CreateUserHandler } from '../../application/commands/handlers/create-user.handler';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { AccessTokenDbModelService } from '../../domain/services/access-token-db-model.service';
import { UserDbModelService } from '../../domain/services/user-db-model.service';
import { SaveAccessTokenRepositoryHandler } from '../../infrastructure/repositories/commands/save-access-token.repository';
import { CreateUserRepositoryHandler } from '../../infrastructure/repositories/commands/create-user.repository';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';
import { JwtService } from 'src/auth/infrastructure/services/jwt.service';


@Controller('auth') 
export class CreateUserController {
  private readonly createUserHandler: CreateUserHandler;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userDatabase: UserDbModelService,
    private readonly accessTokenDatabase: AccessTokenDbModelService
  ) {
    const saveAccessTokenRepo = new SaveAccessTokenRepositoryHandler(this.accessTokenDatabase);
    const createUserRepository = new CreateUserRepositoryHandler(this.userDatabase);

    this.createUserHandler = new CreateUserHandler(
      createUserRepository,
      saveAccessTokenRepo,
      this.jwtService
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<CustomResponse> {
    const { firstName, lastName, email, password } = createUserDto;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('All fields must be filled');
    }

    try {
      const command = new CreateUserCommand(firstName, lastName, email, password);
      const result = await this.createUserHandler.execute(command);

      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        STATUS.SUCCESS,
        result,
        '',
        'User created successfully'
      );

      return customResponse;
    } catch (error) {
      const customResponse = new CustomResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        STATUS.ERROR,
        '',
        error.message || error,
        'Failed to create user'
      );

      throw new InternalServerErrorException(customResponse.toJSON());
    }
  }
}
