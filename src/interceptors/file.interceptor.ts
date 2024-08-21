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
import { Reflector } from '@nestjs/core';
import { filesUploadRules } from 'src/media/validation-schema/image-upload.schema';
import * as Joi from '@hapi/joi';
import { FileUploadRule } from 'src/media/interfaces/file-upload-rule.interface';

@Injectable()
export class MediaFileUploadInterceptor implements NestInterceptor {
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

    const filesInterceptor = FilesInterceptor(this.fieldName);

    const filesInterceptorInstance = new (filesInterceptor as any)(
      new Reflector(),
    );
    await filesInterceptorInstance.intercept(context, next);

    const body = request.body;

    const { error } = this.bodyValidation.validate(body);

    if (error) {
      throw new BadRequestException(`Invalid body: ${error.message}`);
    }

    const imagesValidationRule = filesUploadRules[body.type];

    if (!imagesValidationRule) {
      throw new BadRequestException('Types is not allowed');
    }

    const files = this.getFilesFromRequest(request);

    const { error: fileValidtionError } = this.validateFilesType(
      files,
      imagesValidationRule,
    );

    if (fileValidtionError) {
      throw new BadRequestException(
        `Invalid body: ${fileValidtionError.message}`,
      );
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
        `Max total size is ${imagesValidationRule.totalMaxSize}`,
      );
    }

    return next.handle();
  }

  private getFilesFromRequest(request: Request): Express.Multer.File[] {
    const files = request.files;

    if (!files.length) {
      throw new BadRequestException('No files found in the request');
    }

    return files as Express.Multer.File[];
  }

  private validateFilesType(
    files: Express.Multer.File[],
    rule: FileUploadRule,
  ) {
    const fileSchema = Joi.object({
      fieldname: Joi.string().valid('images').required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/png').required(),
      buffer: Joi.binary().required(),
      size: Joi.number().max(rule.maxFileSize).required(),
    });

    const filesArraySchema = Joi.array()
      .items(fileSchema)
      .min(1)
      .max(rule.maxFiles)
      .required();

    return filesArraySchema.validate(files);
  }
}
