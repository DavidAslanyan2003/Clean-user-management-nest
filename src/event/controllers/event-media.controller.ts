import {
  Controller,
  Post,
  HttpStatus,
  Body,
  HttpException,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ERROR_MESSAGE } from '../../helpers/constants/status';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { CreateEventMediaDto } from '../dtos/create-media.dto';
import { EventMedia } from '../entities/event-media.entity';
import { EventMediaService } from '../services/media.service';

@Controller('api/v1/event/media')
@ApiTags('Events-Media')
export class EventMediaController {
  constructor(private readonly eventMediaService: EventMediaService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a new event media',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for creating the event media.',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<EventMedia>,
  })
  @ApiBody({ type: CreateEventMediaDto })
  async createEventMedia(
    @Body() createEventMediaDto: CreateEventMediaDto,
  ): Promise<CustomResponse<EventMedia>> {
    const response = await this.eventMediaService.createMedia(
      createEventMediaDto,
    );

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }
}
