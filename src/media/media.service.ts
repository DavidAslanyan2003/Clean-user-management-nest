import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

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

  constructor(private configService: ConfigService) {
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
    const fileUuid = uuidv4();
    const uploadPromises: Promise<string>[] = [];

    for (const [, file] of files.entries()) {
      const uploadPromise = this.uploadFile(
        fileUuid,
        clientId,
        type,
        file,
        eventId,
      );
      uploadPromises.push(uploadPromise);
    }

    const executedPromises = await Promise.allSettled(uploadPromises);

    return executedPromises;
  }

  async uploadFile(
    fileUuid: string,
    clientId: number,
    type: string,
    file: Express.Multer.File,
    eventId: string | undefined | null,
  ): Promise<any> {
    if (!file || !file.originalname) {
      throw new Error('Invalid file object or missing originalname');
    }

    const uploadedFile = await this.uploadToS3(
      fileUuid,
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
        fileUuid,
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

    return uploadedFile;
  }

  private async uploadToS3(
    fileUuid: string,
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
    const fileName = `event-images-test/${clientId}/${size}/${fileUuid}-${type}-${originalname}-${
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
        throw new Error('Image not saved in s3!');
      }

      return `${this.s3Url}${fileName}`;
    } catch (error) {
      this.logger.error('Cannot save file to s3');
      // throw error;
    }
  }

  async deleteByPrefix(filePrefix: string, clientId: number): Promise<void> {
    try {
      const folderNames = ['original', ...Object.keys(this.sizes)];

      const deletePromises = [];

      for (const folderName of folderNames) {
        const deleteParams = {
          Bucket: this.bucket,
          Key: `event-images-test/${clientId}/${folderName}/${filePrefix}`,
        };

        deletePromises.push(
          this.s3.send(new DeleteObjectCommand(deleteParams)),
        );
      }

      await Promise.all(deletePromises);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async checkUserHasAllowedStorageSize(
    clientId: number,
    files: Express.Multer.File[],
  ): Promise<boolean> {
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

      return filesSizes <= freeSpace;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
