import { Controller, Post, Body, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException, Inject } from '@nestjs/common';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';
import { UserManagementService } from 'src/auth/domain/services/user-management.service';
import { IUserManagementService } from 'src/auth/infrastructure/interfaces/create-user-service.interface';
import { LoginUserDto } from 'src/auth/application/commands/dtos/input/login-user.dto';
import { LoginUserCommand } from 'src/auth/application/commands/login-user.command';


@Controller('auth/login') 
export class LoginUserController {
  public constructor(
    @Inject(UserManagementService) private readonly userManagementService: IUserManagementService
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() loginUserDto: LoginUserDto): Promise<CustomResponse> {
    const { email, password } = loginUserDto;

    if (!email || !password) {
      throw new BadRequestException('All fields must be filled');
    }

    try {
      const command = new LoginUserCommand(email, password);
      const result = await this.userManagementService.loginUser(command);

      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        STATUS.SUCCESS,
        result,
        '',
        'User logged in successfully'
      );

      return customResponse;
    } catch (error) {
      const customResponse = new CustomResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        STATUS.ERROR,
        '',
        error.message || error,
        'Failed to login'
      );

      throw new InternalServerErrorException(customResponse.toJSON());
    }
  }
}
