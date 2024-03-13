import { Test, TestingModule } from '@nestjs/testing';
import { MailerServiceService } from './mailer-service.service';

describe('MailerServiceService', () => {
  let service: MailerServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailerServiceService],
    }).compile();

    service = module.get<MailerServiceService>(MailerServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
