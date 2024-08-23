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
