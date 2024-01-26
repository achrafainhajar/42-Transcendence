import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RelationshipModule } from 'src/relationship/relationship.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ulid } from 'ulid';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from 'src/message/message.service';
import { ChannelMemberModule } from 'src/channel-member/channel-member.module';
import { ChannelMemberService } from 'src/channel-member/channel-member.service';

@Module({
  imports: [
    RelationshipModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${ulid()}.${file.originalname.split('.').pop()}`);
        },
      }),
    }),
  ],
  providers: [UserService,MessageService,ChannelMemberService],
  controllers: [UserController],
  exports: [UserService,],
})
export class UserModule {}

export { UserService };
