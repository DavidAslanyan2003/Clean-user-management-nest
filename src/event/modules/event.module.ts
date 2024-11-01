import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { Event } from '../../event/entities/event.entity';
import { Category } from '../../category/entities/category.entity';
import { EventInstance } from '../entities/event-instance.entity';
import { BasicInfo } from '../entities/basic-info.entity';
import { Agenda } from '../entities/agenda.entity';
import { Slot } from '../entities/slot.entity';
import { Tag } from '../entities/tag.entity';
import { AuditLog } from '../entities/audit-log.entity';
import { FAQ } from '../entities/faq.entity';
import { EventMedia } from '../entities/event-media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Event,
      EventInstance,
      Date,
      BasicInfo,
      Agenda,
      Slot,
      Tag,
      EventMedia,
      AuditLog,
      FAQ,
    ]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class EventModule {}
