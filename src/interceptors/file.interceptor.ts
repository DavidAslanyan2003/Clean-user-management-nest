import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { I18nContext } from 'nestjs-i18n';
import { Reflector } from '@nestjs/core';
import { filesUploadRules } from 'src/media/validation-schema/image-upload.schema';
import * as Joi from '@hapi/joi';
import { FileUploadRule } from 'src/media/interfaces/file-upload-rule.interface';

@Injectable()
export class MediaFileUploadInterceptor implements NestInterceptor {
  private i18n: I18nContext;
  maxCount: number;

  constructor(
    private readonly fieldName: string,
    private readonly bodyValidation: Joi.schema,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    this.i18n = I18nContext.current();

    const filesInterceptor = FilesInterceptor(this.fieldName);

    const filesInterceptorInstance = new (filesInterceptor as any)(
      new Reflector(),
    );
    await filesInterceptorInstance.intercept(context, next);

    const body = request.body;

    const { error } = this.bodyValidation.validate(body);
    if (error) {
      throw new BadRequestException(`${error.message}`);
    }

    const imagesValidationRule = filesUploadRules[body.type];
    if (!imagesValidationRule) {
      throw new BadRequestException(
        this.i18n.translate('error-messages.FILE_TYPE'),
      );
    }

    const files = this.getFilesFromRequest(request);

    const { error: fileValidtionError } = this.validateFilesType(
      files,
      imagesValidationRule,
    );

    if (fileValidtionError) {
      throw new BadRequestException(`${fileValidtionError.message}`);
    }

    if (!imagesValidationRule.totalMaxSize) {
      return next.handle();
    }

    const filesTotalSize = files.reduce((acc, file) => {
      acc += file.size;

      return acc;
    }, 0);

    if (filesTotalSize > imagesValidationRule.totalMaxSize) {
      throw new BadRequestException(
        this.i18n.translate('error-messages.FILES_MAX_TOTAL_SIZE', {
          args: { totalMaxSize: imagesValidationRule.totalMaxSize },
        }),
      );
    }

    return next.handle();
  }

  private getFilesFromRequest(request: Request): Express.Multer.File[] {
    const files = request.files;

    if (!files.length) {
      throw new BadRequestException(
        this.i18n.translate('error-messages.NO_FILES'),
      );
    }

    return files as Express.Multer.File[];
  }

  private validateFilesType(
    files: Express.Multer.File[],
    rule: FileUploadRule,
  ) {
    const fileSchema = Joi.object({
      fieldname: Joi.string()
        .valid('images')
        .required()
        .messages({
          'any.only': this.i18n.translate(
            'error-messages.IMAGES_FIELDNAME_INVALID',
          ),
          'any.required': this.i18n.translate(
            'error-messages.FIELDNAME_REQUIRED',
          ),
        }),
      originalname: Joi.string()
        .required()
        .messages({
          'any.required': this.i18n.translate(
            'error-messages.ORIGINALNAME_REQUIRED',
          ),
        }),
      encoding: Joi.string()
        .required()
        .messages({
          'any.required': this.i18n.translate(
            'error-messages.ENCODING_REQUIRED',
          ),
        }),
      mimetype: Joi.string()
        .valid('image/jpeg', 'image/png', 'image/jpg')
        .required()
        .messages({
          'any.only': this.i18n.translate('error-messages.MIMETYPE_INVALID'),
          'any.required': this.i18n.translate(
            'error-messages.MIMETYPE_REQUIRED',
          ),
        }),
      buffer: Joi.binary()
        .required()
        .messages({
          'any.required': this.i18n.translate('error-messages.BUFFER_REQUIRED'),
        }),
      size: Joi.number()
        .max(rule.maxFileSize)
        .required()
        .messages({
          'number.max': this.i18n.translate('error-messages.SIZE_MAX', {
            args: { max: rule.maxFileSize },
          }),
          'any.required': this.i18n.translate('error-messages.SIZE_REQUIRED'),
        }),
    });

    const filesArraySchema = Joi.array()
      .items(fileSchema)
      .min(1)
      .max(rule.maxFiles)
      .required()
      .messages({
        'array.min': this.i18n.translate('error-messages.MIN_FILES', {
          args: { min: 1 },
        }),
        'array.max': this.i18n.translate('error-messages.MAX_FILES', {
          args: { max: rule.maxFiles },
        }),
        'any.required': this.i18n.translate('error-messages.FILES_REQUIRED'),
      });

    return filesArraySchema.validate(files);
  }
}
