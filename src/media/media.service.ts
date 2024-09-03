import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  ListObjectsV2Command,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { I18nService } from 'nestjs-i18n';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from 'src/helpers/validations/service-helper-functions/category-helper-functions';
import { ERROR_FILE_PATH } from 'src/helpers/constants/constants';

@Injectable()
export class MediaService {
  private logger = new Logger(MediaService.name);
  private readonly region: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly s3Url: string;
  private readonly userSotrageSize: number;
  private readonly sizes: { [key: string]: number } = {
    small: 200,
    medium: 500,
    large: 1000,
  };
  private s3: S3Client;

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private configService: ConfigService,
    private readonly i18n: I18nService,
  ) {
    this.region = configService.get<string>('S3_REGION') || 'eu-west-1';
    this.accessKey = configService.get<string>('AWS_ACCESS_KEY');
    this.bucket = this.configService.get<string>('S3_BUCKET');
    this.secretKey = configService.get<string>('AWS_SECRET_KEY');
    this.s3Url = configService.get<string>('S3_BASE_URL');
    this.userSotrageSize =
      configService.get<number>('USER_STORAGE_SIZE') * 1024 * 1024;
    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKey,
        secretAccessKey: this.secretKey,
      },
    });
  }

  async uploadFiles(
    clientId: number,
    type: string,
    files: Express.Multer.File[],
    eventId: string | undefined | null,
  ): Promise<object> {
    const fileUUID = uuidv4();
    const uploadPromises: Promise<string>[] = [];
    try {
      for (const [, file] of files.entries()) {
        const uploadPromise = this.uploadFile(
          fileUUID,
          clientId,
          type,
          file,
          eventId,
        );
        uploadPromises.push(uploadPromise);
      }

      const executedPromises = (await Promise.allSettled(uploadPromises)).map(
        (executedPromise) => executedPromise['value'],
      );

      return translatedSuccessResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_SUCCESS_MESSAGE',
        executedPromises,
      );
    } catch (error) {
      return translatedErrorResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_ERROR_MESSAGE',
        error,
      );
    }
  }

  async uploadFile(
    fileUUID: string,
    clientId: number,
    type: string,
    file: Express.Multer.File,
    eventId: string | undefined | null,
  ): Promise<any> {
    try {
      const uploadedFile = await this.uploadToS3(
        fileUUID,
        clientId,
        type,
        'original',
        file,
        eventId,
      );

      for (const [sizeName, width] of Object.entries(this.sizes)) {
        const resizedBuffer = await sharp(file.buffer)
          .resize(width)
          .withMetadata()
          .toBuffer();

        await this.uploadToS3(
          fileUUID,
          clientId,
          type,
          sizeName,
          {
            buffer: resizedBuffer,
            mimetype: file.mimetype,
            originalname: file.originalname,
          },
          eventId,
        );
      }
      return translatedSuccessResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_SUCCESS_MESSAGE',
        uploadedFile,
      );
    } catch (error) {
      return translatedErrorResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_ERROR_MESSAGE',
        error,
      );
    }
  }

  private async uploadToS3(
    fileUUID: string,
    clientId: number,
    type: string,
    size: string,
    file: { buffer: Buffer; mimetype: string; originalname: string },
    eventId: string | undefined | null,
  ): Promise<any> {
    const originalname = path.basename(
      file.originalname,
      path.extname(file.originalname),
    );
    const fileName = `event-images-test/${clientId}/${size}/${fileUUID}-${type}-${originalname}-${
      eventId || 'none'
    }`;

    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: this.bucket,
      Key: fileName,
      ContentType: file.mimetype,
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode !== 200) {
        throw new Error(
          this.i18n.translate('api.IMAGE_SAVE_ERROR_MESSAGE', {
            lang: this.request['language'],
          }),
        );
      }

      return `${this.s3Url}${fileName}`;
    } catch (error) {
      this.logger.error('Cannot save file to s3');
      throw new BadRequestException(error.message);
    }
  }

  async deleteByPrefix(
    filePrefix: string,
    clientId: number,
  ): Promise<CustomResponse<void>> {
    try {
      const folderNames = ['original', ...Object.keys(this.sizes)];

      const deletePromises = folderNames.map(async (folderName) => {
        const deleteParams = {
          Bucket: this.bucket,
          Key: `event-images-test/${clientId}/${folderName}/${filePrefix}`,
        };

        try {
          await this.s3.send(
            new HeadObjectCommand({
              Bucket: deleteParams.Bucket,
              Key: deleteParams.Key,
            }),
          );
        } catch (error) {
          if (error.name === 'NotFound') {
            const message = this.i18n.translate(
              `${ERROR_FILE_PATH}.ITEM_NOT_FOUND`,
              {
                lang: this.request['language'],
              },
            );
            throw new Error(message);
          }
          throw error;
        }

        const deleteResponse = await this.s3.send(
          new DeleteObjectCommand(deleteParams),
        );
        return deleteResponse;
      });

      await Promise.all(deletePromises);

      return translatedSuccessResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_DELETE_SUCCESS_MESSAGE',
        null,
      );
    } catch (error) {
      return translatedErrorResponse<void>(
        this.i18n,
        this.request['language'],
        'FILE_DELETE_ERROR_MESSAGE',
        error,
      );
    }
  }

  async checkUserHasAllowedStorageSize(
    clientId: number,
    files: Express.Multer.File[],
  ): Promise<CustomResponse<boolean>> {
    try {
      const listParams = {
        Bucket: this.bucket,
        Prefix: `event-images-test/${clientId}/original/`,
      };

      const listCommand = new ListObjectsV2Command(listParams);
      const listResponse = await this.s3.send(listCommand);

      const filesSizes = files.reduce((acc, file) => {
        acc += file.size;

        return acc;
      }, 0);

      const userUsedStorage =
        (listResponse.Contents || 0) &&
        listResponse.Contents.reduce((acc, file) => {
          acc += file.Size;

          return acc;
        }, 0);
      const freeSpace = this.userSotrageSize - userUsedStorage;
      return translatedSuccessResponse<boolean>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_SUCCESS_MESSAGE',
        filesSizes <= freeSpace,
      );
    } catch (error) {
      return translatedErrorResponse<boolean>(
        this.i18n,
        this.request['language'],
        'FILE_UPLOAD_ERROR_MESSAGE',
        error,
      );
    }
  }
}