import { Injectable, Scope, Inject, BadRequestException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { FAQ } from '../entities/faq.entity';
import { I18nService } from 'nestjs-i18n';
import { ERROR_FILE_PATH } from '../../helpers/constants/constants';
import { QueryRunner, Repository } from 'typeorm';
import { getEvent } from '../../helpers/validations/service-helper-functions/event-validation';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import {
  translatedSuccessResponse,
  translatedErrorResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';

@Injectable({ scope: Scope.REQUEST })
export class FaqService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    private readonly i18n: I18nService,
    @InjectRepository(FAQ)
    private readonly faqRepository: Repository<FAQ>,
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

  async getFaqs(
    eventId: string,
    page?: number,
    limit?: number,
    orderBy?: string,
    order?: string,
  ): Promise<CustomResponse<FAQ[]>> {
    const queryRunner =
      this.faqRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];
    page = page || 1;
    limit = limit || 10;
    const offset = (page - 1) * limit;
    orderBy = orderBy || 'id';
    const sortOrder = order === 'descend' ? 'DESC' : 'ASC';

    try {
      let faqs: FAQ[];

      const event = await getEvent(eventId, this.i18n, queryRunner, locale);

      let query = queryRunner.manager
        .getRepository(FAQ)
        .createQueryBuilder('faq')
        .leftJoin('faq.event', 'e')
        .where('e.id = :eventId', { eventId });

      if (locale) {
        query = query.andWhere('faq.question ? :locale', { locale });
      }

      faqs = await query
        .orderBy(`faq.${orderBy}`, sortOrder)
        .skip(offset)
        .take(limit)
        .getMany();

      for (const faq of faqs) {
        faq.answer = faq.answer[locale] as unknown as Record<string, string>;
        faq.question = faq.question[locale] as unknown as Record<
          string,
          string
        >;
      }

      await queryRunner.commitTransaction();

      return translatedSuccessResponse<FAQ[]>(
        this.i18n,
        locale,
        'SUCCESSED_FETCH_FAQS',
        faqs,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();

      return translatedErrorResponse<FAQ[]>(
        this.i18n,
        locale,
        'FAILED_FETCH_FAQS',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
