import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { CheckUUIDPipe } from 'src/helpers/validations/pipes/check-uuid-pipe';
import { FAQ } from '../entities/faq.entity';
import { FaqService } from '../services/faq.service';
import { ERROR_MESSAGE } from 'src/helpers/constants/status';

@Controller('api/v1/event/faq')
@ApiTags('Event-Faq')
export class FaqController {
  constructor(private readonly FAQService: FaqService) {}

  @Get(':eventId')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves all FAQs',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'FAQs were not found',
  })
  @ApiResponse({
    description: 'Response',
    type: CustomResponse<[FAQ]>,
  })
  @ApiParam({ name: 'eventId', required: true })
  async getById(
    @Param('eventId', CheckUUIDPipe) eventId: string,
  ): Promise<CustomResponse<FAQ[]>> {
    const response = await this.FAQService.getFaqs(eventId);

    if (response.status === ERROR_MESSAGE) {
      throw new HttpException(response, 400);
    }

    return response;
  }
}
