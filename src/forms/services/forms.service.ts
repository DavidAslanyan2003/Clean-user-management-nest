import { Injectable } from '@nestjs/common';
import { NewsLetterDto } from '../dtos/news-letter.dto';
import { NewsLetter } from '../entities/news-letter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactUsDto } from '../dtos/contact-us.dto';
import { ContactUs } from '../entities/contact-us.entity';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from 'src/helpers/constants/status';
import { RESPONSE_MESSAGES } from 'src/helpers/response/response-messages';

@Injectable()
export class FormsService {
  constructor(
    @InjectRepository(NewsLetter)
    private newsLetterRepository: Repository<NewsLetter>,

    @InjectRepository(ContactUs)
    private contactUsRepository: Repository<ContactUs>,
  ) {}

  async postNewsLetterForm(newsLetterDto: NewsLetterDto) {
    const queryRunner =
      this.newsLetterRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newsLetterFinalForm = {
        name: newsLetterDto.name,
        email: newsLetterDto.email,
      };

      await queryRunner.manager
        .getRepository(NewsLetter)
        .save(newsLetterFinalForm);
      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        newsLetterFinalForm,
        null,
        RESPONSE_MESSAGES.NEWS_LETTER_SUBMIT,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse(
        ERROR_MESSAGE,
        error,
        null,
        RESPONSE_MESSAGES.NEWS_LETTER_FAIL,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async postContactUsForm(contactUsDto: ContactUsDto) {
    const queryRunner =
      this.contactUsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const contactUsData = {
      name: contactUsDto.name,
      email: contactUsDto.email,
      subject: contactUsDto.subject,
      message: contactUsDto.message,
    };

    try {
      await queryRunner.manager.getRepository(ContactUs).save(contactUsData);
      await queryRunner.commitTransaction();
      return new CustomResponse(
        SUCCESS_MESSAGE,
        contactUsData,
        null,
        RESPONSE_MESSAGES.CONTACT_US_SUBMIT,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return new CustomResponse(
        ERROR_MESSAGE,
        error,
        null,
        RESPONSE_MESSAGES.CONTACT_US_FAIL,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
