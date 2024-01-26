import { Test, TestingModule } from '@nestjs/testing';
import { InviteGateway } from './invite.gateway';
import { InviteService } from './invite.service';

describe('InviteGateway', () => {
  let gateway: InviteGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InviteGateway, InviteService],
    }).compile();

    gateway = module.get<InviteGateway>(InviteGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
