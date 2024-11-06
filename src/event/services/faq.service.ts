import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FAQ } from '../entities/faq.entity';
import { I18nService } from 'nestjs-i18n';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { QueryRunner } from 'typeorm';
import { getEvent } from '../../helpers/validations/service-helper-functions/event-validation';

@Injectable({ scope: Scope.REQUEST })
export class FaqService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
  ) {}

  async createFaq(
    faqs: {
      question: Record<string, string>;
      answer: Record<string, string>;
    }[],
    eventId: string,
    queryRunner: QueryRunner,
  ): Promise<FAQ[]> {
    const locale = this.request['language'];

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

      const event = await getEvent(eventId, this.i18n, queryRunner, locale);

      const savedFaq = queryRunner.manager.getRepository(FAQ).save({
        event: event,
        question: question,
        answer: answer,
        version: 1,
      });

      faqArray.push(savedFaq);
    }

    return faqArray;
  }
}
