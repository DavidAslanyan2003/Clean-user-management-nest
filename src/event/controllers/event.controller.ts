import {
  Controller,
  Post,
  HttpStatus,
  Body,
  HttpException,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ERROR_MESSAGE } from '../../helpers/constants/status';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import { CreateEventDetailsDto } from '../dtos/create-event.dto';
import { Event } from '../entities/event.entity';
import { EventService } from '../services/event.service';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';

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

  @Get('/list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get events',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Events were not found',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<[Event]>,
  })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'order', required: false })
  async getEvents(
    @Query('userId', CheckUUIDPipe) userId?: string,
    @Query('categoryId', CheckUUIDPipe) categoryId?: string,
    @Query('createdAt') createdAt?: Date,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: string,
    @Query('order') order?: string,
  ) {
    const response = await this.eventService.getEventList(
      createdAt,
      categoryId,
      userId,
      page,
      limit,
      orderBy,
      order,
    );

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }

  @Get('/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get events',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Event was not found',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<Event>,
  })
  @ApiParam({ name: 'id', required: true })
  @ApiQuery({ name: 'allLanguages', required: true })
  async get(
    @Param('id', CheckUUIDPipe) id: string,
    @Query('allLanguages') allLanguages?: string,
  ) {
    const response = await this.eventService.getEvent(id, allLanguages);

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }
}
