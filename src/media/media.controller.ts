import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  HttpStatus,
  HttpCode,
  Delete,
  Req,
  Param,
  Get,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { imagesUploadBodySchema } from './validation-schema/image-upload.schema';
import { MediaFileUploadInterceptor } from '../interceptors/file.interceptor';
import { I18nService } from 'nestjs-i18n';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { translatedErrorResponse } from '../helpers/validations/service-helper-functions/category-helper-functions';
import { CustomResponse } from '../helpers/response/custom-response.dto';

@ApiTags('media')
@Controller('api/v1/media')
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly i18n: I18nService,
  ) {}

  @Post()
  @UseInterceptors(
    new MediaFileUploadInterceptor('images', imagesUploadBodySchema),
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload media files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Media upload request body',
    schema: {
      type: 'object',
      properties: {
        type: { type: 'string', description: 'Type of the media' },
        eventId: {
          type: 'string',
          description: 'Event ID associated with the media',
        },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
            description: 'Files to upload',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Files have been successfully uploaded.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to upload files due to lack of space or invalid data.',
  })
  async uploadFiles(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body() body: any,
    @Req() req: Request,
  ): Promise<object> {
    const lang = req['language'];
    //99 is auth userId, now it hardcoded
    const checkUserAllowedSizeResponse =
      await this.mediaService.checkUserHasAllowedStorageSize(99, files);
    const isHasFreeSpace = checkUserAllowedSizeResponse.data;

    if (checkUserAllowedSizeResponse.error) {
      return checkUserAllowedSizeResponse;
    }

    if (!isHasFreeSpace) {
      return translatedErrorResponse(
        this.i18n,
        lang,
        'FREE_SPACE_ERROR_MESSAGE',
      );
    }
    //99 is auth userId, now it hardcoded
    return await this.mediaService.uploadFiles(
      99,
      body.type,
      files,
      body.eventId,
    );
  }

  @Delete(':fileIdentifier')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete media files by prefix' })
  @ApiParam({
    name: 'fileIdentifier',
    required: true,
    description: 'The prefix used to identify the files to delete',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Files have been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Failed to delete files due to invalid prefix or other issues.',
  })
  async delete(
    @Param('fileIdentifier') fileIdentifier: string,
  ): Promise<CustomResponse<void>> {
    //99 is auth userId, now it hardcoded
    return await this.mediaService.deleteByPrefix(fileIdentifier, 99);
  }

  @Get(':size')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get media files by prefix' })
  @ApiParam({
    name: 'size',
    required: true,
    description: 'The size of the file',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Files have been successfully fetched.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get files.',
  })
  async get(@Param('size') size: string): Promise<CustomResponse<any>> {
    //99 is auth userId, now it hardcoded
    return await this.mediaService.getFileByUserId(size, 99);
  }
}
