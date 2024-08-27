import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  Res,
  HttpStatus,
  HttpCode,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { imagesUploadBodySchema } from './validation-schema/image-upload.schema';
import { Response } from 'express';
import { MediaFileUploadInterceptor } from 'src/interceptors/file.interceptor';
import { I18nService } from 'nestjs-i18n';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

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
  async UploadFiles(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body() body,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const lang = req['language'];
    //99 is auth userId, now it hardcoded
    const isHasFreeSpace =
      await this.mediaService.checkUserHasAllowedStorageSize(99, files);

    if (!isHasFreeSpace) {
      throw new BadRequestException(
        this.i18n.translate('api.FREE_SPACE_ERROR_MESSAGE', { lang }),
      );
    }
    //99 is auth userId, now it hardcoded
    const results = await this.mediaService.uploadFiles(
      99,
      body.type,
      files,
      body.eventId,
    );

    return res.status(HttpStatus.CREATED).json({
      message: this.i18n.translate('api.FILE_UPLOAD_SUCCESS_MESSAGE', { lang }),
      data: results,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete media files by prefix' })
  @ApiQuery({
    name: 'prefix',
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
    @Query('prefix') prefix: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const lang = req['language'];
    //99 is auth userId, now it hardcoded
    await this.mediaService.deleteByPrefix(prefix, 99);

    return res.status(HttpStatus.NO_CONTENT).json({
      message: this.i18n.translate('api.FILE_DELETE_SUCCESS_MESSAGE', { lang }),
    });
  }
}
