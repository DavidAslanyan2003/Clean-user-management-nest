import { Controller, HttpCode, HttpStatus, InternalServerErrorException, Param, Delete } from '@nestjs/common';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';
import { DeleteUserCommand } from 'src/auth/application/commands/delete-user.command';
import { DeleteUserCommandHandler } from 'src/auth/application/commands/handlers/delete-user.handler';


@Controller('auth') 
export class DeleteUserController {
  public constructor(
    private readonly deleteUserHandler: DeleteUserCommandHandler
  ) {}

  @Delete("/:id")
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Param('id', CheckUUIDPipe) id: string,
  ): Promise<CustomResponse> {
    try {
      const command = new DeleteUserCommand(id);
      const result = await this.deleteUserHandler.execute(command);

      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        STATUS.SUCCESS,
        result,
        '',
        'User deleted successfully'
      );

      return customResponse;
    } catch (error) {
      const customResponse = new CustomResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        STATUS.ERROR,
        '',
        error.message || error,
        'Failed to delete user'
      );

      throw new InternalServerErrorException(customResponse.toJSON());
    }
  }
}
