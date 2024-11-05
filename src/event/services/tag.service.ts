import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import { Tag } from '../entities/tag.entity';
import { REQUEST } from '@nestjs/core';
import { RedisService } from '../../helpers/redis/redis.service';
import { I18nService } from 'nestjs-i18n';
import {
  translatedErrorResponse,
  translatedSuccessResponse,
} from '../../helpers/validations/service-helper-functions/category-helper-functions';
import { checkTagName } from '../../helpers/validations/service-helper-functions/tag-validation';

@Injectable({ scope: Scope.REQUEST })
export class TagService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly redisService: RedisService,
    private readonly i18n: I18nService,
  ) {}

  async createTags(newTags: string[]): Promise<CustomResponse<Tag[]>> {
    const queryRunner =
      this.tagRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const locale = this.request['language'];

    try {
      let tags: Tag[] = [];

      for (const tagName of newTags) {
        checkTagName(tagName, locale, this.i18n);

        const matchingTagId = await this.matchingRedisTag(tagName);

        if (!matchingTagId) {
          const newTag = this.tagRepository.create({
            tag_name: tagName,
            created_at: new Date(),
            version: 1,
          });

          const savedTag = await queryRunner.manager
            .getRepository(Tag)
            .save(newTag);

          tags.push(savedTag);
          this.storeTag(savedTag);
        } else {
          const newTag = await queryRunner.manager.getRepository(Tag).findOne({
            where: { id: matchingTagId },
          });

          if (newTag) {
            tags.push(newTag);
          }
        }
      }
      await queryRunner.commitTransaction();

      return translatedSuccessResponse<Tag[]>(
        this.i18n,
        locale,
        'SUCCESSED_CREATE_TAGS',
        tags,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return translatedErrorResponse<Tag[]>(
        this.i18n,
        locale,
        'FAILED_CREATE_TAGS',
        error,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async storeTag(tag: Tag): Promise<void> {
    const client = this.redisService.getClient();
    await client.set(`tag:${tag.id}`, tag.tag_name);
    await client.zadd('tag_names', 0, `${tag.tag_name}:${tag.id}`);
  }

  async matchingRedisTag(tagName: string): Promise<string> {
    const client = this.redisService.getClient();
    const exactTag = `${tagName}:`;
    const tags = await client.zrangebylex(
      'tag_names',
      `[${exactTag}`,
      `[${exactTag}\xff`,
    );

    return tags.length > 0 ? tags[0].split(':')[1] : null;
  }
}
