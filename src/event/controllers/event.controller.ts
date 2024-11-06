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
import { CreateEventDetailsDto } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { EventService } from '../services/event.service';

@Controller('api/v1/event')
@ApiTags('Events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a new event',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for creating the event.',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<Event>,
  })
  @ApiBody({ type: CreateEventDetailsDto })
  async createEvent(
    @Body() createEventDto: CreateEventDetailsDto,
  ): Promise<CustomResponse<Event>> {
    const userId = 'd290f1ee-6c54-4b01-90e6-d701748f0851';
    const response = await this.eventService.createEvent(
      createEventDto,
      userId,
    );

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }
}
