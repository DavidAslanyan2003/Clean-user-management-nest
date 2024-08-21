import { Test, TestingModule } from '@nestjs/testing';
import { MediaService } from './media.service';
import { ConfigService } from '@nestjs/config';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MediaService, ConfigService],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
