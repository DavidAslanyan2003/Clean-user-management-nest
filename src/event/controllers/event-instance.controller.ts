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
import { EventInstance } from '../entities/event-instance.entity';
import { CreateEventInstanceDto } from '../dtos/create-event-instance.dto';
import { EventInstanceService } from '../services/event-instance.service';

@Controller('api/v1/event/instance')
@ApiTags('Events-Instances')
export class EventInstanceController {
  constructor(private readonly eventInstanceService: EventInstanceService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Creates a new event instance',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for creating the event instance.',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<EventInstance>,
  })
  @ApiBody({ type: CreateEventInstanceDto })
  async createEvent(
    @Body() createEventInstanceDto: CreateEventInstanceDto,
  ): Promise<CustomResponse<EventInstance>> {
    const response = await this.eventInstanceService.createEventInstance(
      createEventInstanceDto,
    );

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }
}
