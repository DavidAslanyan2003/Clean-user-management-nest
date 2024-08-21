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
} from '@nestjs/common';
import { MediaService } from './media.service';
import { imagesUploadBodySchema } from './validation-schema/image-upload.schema';
import { Response } from 'express';
import { MediaFileUploadInterceptor } from 'src/interceptors/file.interceptor';

@Controller('api/v1/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(
    new MediaFileUploadInterceptor('images', imagesUploadBodySchema),
  )
  @HttpCode(HttpStatus.CREATED)
  async UploadFiles(
    @UploadedFiles()
    files: Express.Multer.File[],
    @Body() body,
    @Res() res: Response,
  ) {
    const isHasFreeSpace =
      await this.mediaService.checkUserHasAllowedStorageSize(99, files);

    if (!isHasFreeSpace) {
      throw new BadRequestException('No free space');
    }

    const results = await this.mediaService.uploadFiles(
      99,
      body.type,
      files,
      body.eventId,
    );

    return res.status(HttpStatus.CREATED).json({
      message: 'Files uploaded successfully',
      data: results,
    });
  }
}
