import { Controller, Body, HttpCode, HttpStatus, InternalServerErrorException, BadRequestException, Param, Get } from '@nestjs/common';
import { CustomResponse } from 'src/helpers/custom-response';
import { STATUS } from '../enums/status.enum';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';
import { UpdateUserDto } from 'src/auth/application/commands/dtos/input/update-user.dto';
import { UpdateUserCommand } from 'src/auth/application/commands/update-user.command';
import { UpdateUserCommandHandler } from 'src/auth/application/commands/handlers/update-user.handler';
import { GetUserByIdQuery } from 'src/auth/application/queries/get-user.query';
import { GetUserByIdQueryHandler } from 'src/auth/application/queries/handlers/get-user.handler';


@Controller('auth') 
export class GetUserController {
  public constructor(
    private readonly getUserHandler: GetUserByIdQueryHandler
  ) {}

  @Get("/:id")
  @HttpCode(HttpStatus.CREATED)
  async updateUser(
    @Param('id', CheckUUIDPipe) id: string,
  ): Promise<CustomResponse> {
    try {
      const query = new GetUserByIdQuery(id);
      const result = await this.getUserHandler.execute(query);

      const customResponse = new CustomResponse(
        HttpStatus.CREATED,
        STATUS.SUCCESS,
        result,
        '',
        'User retrieved successfully'
      );

      return customResponse;
    } catch (error) {
      const customResponse = new CustomResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        STATUS.ERROR,
        '',
        error.message || error,
        'Failed to retrieve the user'
      );

      throw new InternalServerErrorException(customResponse.toJSON());
    }
  }
}
