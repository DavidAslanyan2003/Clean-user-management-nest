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
import { EventController } from '../controllers/event.controller';
import { EventService } from '../services/event.service';
import { FaqService } from '../services/faq.service';
import { TagService } from '../services/tag.service';
import { RedisModule } from '../../helpers/redis/redis.module';
import { EventInstanceController } from '../controllers/event-instance.controller';
import { EventInstanceService } from '../services/event-instance.service';
import { AgendaService } from '../services/agenda.service';
import { SlotService } from '../services/slot.service';
import { Dates } from '../entities/dates.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      User,
      Event,
      EventInstance,
      Dates,
      BasicInfo,
      Agenda,
      Slot,
      Tag,
      EventMedia,
      AuditLog,
      FAQ,
    ]),
    RedisModule,
  ],
  controllers: [EventController, EventInstanceController],
  providers: [
    EventService,
    FaqService,
    TagService,
    EventInstanceService,
    AgendaService,
    SlotService,
  ],
  exports: [TypeOrmModule],
})
export class EventModule {}
