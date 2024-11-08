import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { TagService } from '../services/tag.service';
import { Tag } from '../entities/tag.entity';
import { CheckUUIDPipe } from '../../helpers/validations/pipes/check-uuid-pipe';

@Controller('api/v1/event/tag')
@ApiTags('Event-Tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('/list')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves all tags',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tags were not found',
  })
  @ApiResponse({
    description: 'Response',
    type: Tag,
  })
  async get(
    @Query('id', CheckUUIDPipe) id?: string,
    @Query('tagName') tagName?: string,
    @Query('createdAt') createdAt?: Date,
  ): Promise<CustomResponse<Tag | Tag[]>> {
    return this.tagService.getTags(id, tagName, createdAt);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Retrieves matching tags',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Tags were not found',
  })
  @ApiResponse({
    description: 'Response',
    schema: {
      example: {
        id: '1e4a89f1-efc1-4b5b-8fcb-27b9b62c7b45',
        name: 'Name',
      },
    },
  })
  async getMatchingTags(
    @Query('prefix') prefix: string,
  ): Promise<CustomResponse<any[]>> {
    return this.tagService.getMatchingTags(prefix);
  }
}
