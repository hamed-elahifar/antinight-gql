import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { GameResolver } from './game/game.resolver';
import { GameService } from './game/game.service';
import { PubsubModule } from './pubsub/pubsub.module';
import { GameModule } from './game/game.module';

@Module({
  imports: 
    [GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      subscriptions: {
        'graphql-ws': true
      },
      csrfPrevention: false

    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.getOrThrow('MONGO_URL'),
      }),
    }),
      GameModule,
      AuthModule,
      PubsubModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }
