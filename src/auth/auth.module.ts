import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy, jwtConstants } from './strategies';
import { HashingSerivce } from './hashing.service';
import { BcryptSerive } from './bcrypt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/common/guards';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' },
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    SmsModule
  ],
  controllers: [AuthController],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AccessTokenGuard,
    // },
    AuthService,
    AccessTokenStrategy,
    {
      provide: HashingSerivce,
      useClass: BcryptSerive,
    },
  ],
})
export class AuthModule { }
