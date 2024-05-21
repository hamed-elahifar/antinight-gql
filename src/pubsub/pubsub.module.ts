import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      inject: [ConfigService],
      provide: PUB_SUB,
      useFactory: (configServise: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: configServise.get('REDIS_HOST'),
            port: configServise.get('REDIS_PORT'),
          },
        }),
    },
  ],
  exports: [PUB_SUB]
})
export class PubsubModule {}
