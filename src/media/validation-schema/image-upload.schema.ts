import * as Joi from '@hapi/joi';
import { FileUploadRule } from '../interfaces/file-upload-rule.interface';

export const imagesUploadBodySchema = Joi.object({
  type: Joi.string().required(),
  eventId: Joi.when('type', {
    is: 'event',
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const filesUploadRules = {
  event: {
    maxFiles: 10,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    totalMaxSize: 100 * 1024 * 1024, // 100MB
  },
  profile: {
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },
  ad: {
    maxFiles: 2,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
} as Record<string, FileUploadRule>;
