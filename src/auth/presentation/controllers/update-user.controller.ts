import { Controller, Body, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException, Put, Param, Inject } from '@nestjs/common';
import { CreateUserCommandHandler } from '../../application/commands/handlers/create-user.handler';
import { CreateUserCommand } from '../../application/commands/create-user.command';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';
import { UpdateUserDto } from 'src/auth/application/commands/dtos/input/update-user.dto';
import { UpdateUserCommand } from 'src/auth/application/commands/update-user.command';
import { UpdateUserCommandHandler } from 'src/auth/application/commands/handlers/update-user.handler';
import { IUserManagementService } from 'src/auth/infrastructure/interfaces/create-user-service.interface';
import { UserManagementService } from 'src/auth/domain/services/user-management.service';


@Controller('auth') 
export class UpdateUserController {
  public constructor(
    @Inject(UserManagementService) private readonly userManagementService: IUserManagementService
  ) {}

  @Put("/:id")
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Param('id', CheckUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<CustomResponse> {
    const { firstName, lastName, email, password } = updateUserDto;

    if (!firstName || !lastName || !email || !password) {
      throw new BadRequestException('All fields must be filled');
    }

    try {
      const command = new UpdateUserCommand(id, firstName, lastName, email, password);
      const result = await this.userManagementService.updateUser(command);

      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        STATUS.SUCCESS,
        result,
        '',
        'User updated successfully'
      );

      return customResponse;
    } catch (error) {
      const customResponse = new CustomResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        STATUS.ERROR,
        '',
        error.message || error,
        'Failed to update user'
      );

      throw new InternalServerErrorException(customResponse.toJSON());
    }
  }
}
