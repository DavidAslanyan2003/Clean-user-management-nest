import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, IsNotEmpty, IsString } from 'class-validator';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { IsValidLocaleRecord } from '../../helpers/validations/decorators/validate-locale-record';
import { IsValidLocaleArrayRecord } from '../../helpers/validations/decorators/validate-locale-array';

export class EventDetailsDto {
  @ApiProperty({
    description: 'Array of tag names associated with the event',
    example: ['Music', 'Pop', 'Dance'],
  })
  @IsArray({ message: `${ERROR_FILE_PATH}.IS_NOT_ARRAY` })
  @IsString({ each: true, message: `${ERROR_FILE_PATH}.IS_NOT_STRING` })
  tagNames: string[];

  @ApiProperty({
    description: 'Array of questions and answers associated with the event',
    example: [
      {
        question: {
          hy: 'Ինչպես եք?',
          en: 'How are you?',
          ru: 'Как вы?',
        },
        answer: {
          hy: 'Ես լավ եմ, շնորհակալություն:',
          en: 'I am fine, thank you.',
          ru: 'Я в порядке, спасибо.',
        },
      },
    ],
  })
  @IsArray({ message: `${ERROR_FILE_PATH}.IS_NOT_ARRAY` })
  @IsValidLocaleArrayRecord()
  FAQs: { question: Record<string, string>; answer: Record<string, string> }[];

  @ApiProperty({
    description: 'Categories associated with the event',
    type: [String],
    example: ['8a7f8651-7a0f-4cb1-b93e-12a5142e34a2'],
  })
  @IsArray()
  @IsUUID('all', { each: true, message: `${ERROR_FILE_PATH}.ITEM_NOT_FOUND` })
  categories: string[];

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Title of the event in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  eventTitle: Record<string, string>;

  @ApiProperty({
    example: {
      hy: 'string',
      en: 'string',
      ru: 'string',
    },
    description: 'Description of the event in different languages',
  })
  @IsNotEmpty({ message: `${ERROR_FILE_PATH}.IS_EMPTY` })
  @IsValidLocaleRecord()
  eventDescription: Record<string, string>;
}
