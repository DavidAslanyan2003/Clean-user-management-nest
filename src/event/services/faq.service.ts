import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { CustomResponse } from '../../helpers/response/custom-response.dto';
import {
  translatedSuccessResponse,
  translatedErrorResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { Repository } from 'typeorm';
import { FAQ } from '../entities/faq.entity';
import { Event } from '../entities/event.entity';

@Injectable({ scope: Scope.REQUEST })
export class FaqService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(FAQ)
    private readonly FAQRepository: Repository<FAQ>,
    private readonly i18n: I18nService,
  ) {}

  async createFaq(
    faqs: {
      question: Record<string, string>;
      answer: Record<string, string>;
    }[],
    event: Event,
  ): Promise<CustomResponse<FAQ[]>> {
    const queryRunner =
      this.FAQRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      const faqArray = [];

      for (const faq of faqs) {
        const question = faq.question;
        const answer = faq.answer;

        const questionKeyCount = Object.keys(question).length;
        const answerKeyCount = Object.keys(answer).length;

        if (questionKeyCount !== answerKeyCount) {
          throw new BadRequestException(
            this.i18n.translate(`${ERROR_FILE_PATH}.INVALID_INPUT`, {
              lang: locale,
            }),
          );
        }

        const savedFaq = queryRunner.manager.getRepository(FAQ).save({
          question: question,
          answer: answer,
          version: 1,
        });

        faqArray.push(savedFaq);
      }
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<FAQ[]>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_FAQS',
        faqArray,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<FAQ[]>(
        this.i18n,
        locale,
        'FAILED_CREATE_FAQS',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
