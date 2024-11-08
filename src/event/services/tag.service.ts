import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, QueryRunner, Repository } from 'typeorm';
import { Tag } from '../entities/tag.entity';
import { REQUEST } from '@nestjs/core';
import { RedisService } from '../../helpers/redis/redis.service';
import { I18nService } from 'nestjs-i18n';
import { checkTagName } from '../../helpers/validations/service-helper-functions/tag-validation';
import { CustomResponse } from 'src/helpers/response/custom-response.dto';
import {
  translatedSuccessResponse,
  translatedErrorResponse,
} from 'src/helpers/validations/service-helper-functions/category-helper-functions';

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

  async createTags(
    newTags: string[],
    queryRunner: QueryRunner,
  ): Promise<Tag[]> {
    const locale = this.request['language'];

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

    return tags;
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

  async getTags(
    id?: string,
    tagName?: string,
    createdAt?: Date,
  ): Promise<CustomResponse<Tag | Tag[]>> {
    const locale = this.request['language'];

    try {
      if (id) {
        const tag = await this.tagRepository.findOne({
          where: { id: id },
        });
        return translatedSuccessResponse<Tag | Tag[]>(
          this.i18n,
          locale,
          'SUCCESSED_FETCH_TAGS',
          tag,
        );
      } else {
        const searchingData: any = {};

        if (tagName) searchingData.tag_name = tagName;
        if (createdAt) {
          searchingData.created_at = MoreThanOrEqual(createdAt);
        }

        const tags = await this.tagRepository.find({
          where: searchingData,
        });

        return translatedSuccessResponse<Tag | Tag[]>(
          this.i18n,
          locale,
          'SUCCESSED_FETCH_TAGS',
          tags,
        );
      }
    } catch (error) {
      return translatedErrorResponse<Tag | Tag[]>(
        this.i18n,
        locale,
        'FAILED_FETCH_TAGS',
        error,
      );
    }
  }

  async getMatchingTags(prefix: string): Promise<CustomResponse<Tag[]>> {
    const redisClient = this.redisService.getClient();
    const matchingTags: { id: string; name: string }[] = [];

    const startRange = `[${prefix}`;
    const endRange = `[${prefix}\xff`;
    const locale = this.request['language'];

    try {
      const entries = await redisClient.zrangebylex(
        'tag_names',
        startRange,
        endRange,
      );

      for (const entry of entries) {
        const [name, id] = entry.split(':');
        matchingTags.push({ id, name });
      }

      return translatedSuccessResponse<Tag[]>(
        this.i18n,
        locale,
        'SUCCESSED_FETCH_TAGS',
        matchingTags,
      );
    } catch (error) {
      return translatedErrorResponse<Tag[]>(
        this.i18n,
        locale,
        'FAILED_FETCH_TAGS',
        error,
      );
    }
  }
}
