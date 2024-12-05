import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from '../../application/commands/dtos/input/create-user.dto';
import { CreateUserCommandHandler } from '../../application/commands/handlers/create-user.handler';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';


@Controller('auth') 
export class CreateUserController {
  public constructor(
    private readonly createUserHandler: CreateUserCommandHandler
  ) {}

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
