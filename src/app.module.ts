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
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { Environment } from './common/enums/environments.enum';

@Module({
  imports:
    [GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src', 'schema.gql'),
      sortSchema: true,
      playground: true, //process.env.NODE_ENV === Environment.DEV,
      plugins: [
        // ApolloServerPluginLandingPageLocalDefault(),
        // ApolloServerPluginInlineTrace(),
      ],
      // context: ({ req, res }) => ({ req, res }),
      context: ({ req, connection }) =>
        connection
          ? {
            connection: {
              headers: {
                authorization: connection.context['Authorization']
                  ? connection.context['Authorization']
                  : connection.context['authorization'],
              },
            },
          }
          : { req },
      cors: {
        credentials: true,
        origin: true,
      },
      installSubscriptionHandlers: true,
      buildSchemaOptions: {
        orphanedTypes: [],
        // numberScalarMode: 'integer',
      },
      formatError:
        process.env.NODE_ENV == Environment.PROD
          ? (error: GraphQLError) => {
            const graphQLFormattedError: GraphQLFormattedError = {
              message:
                // @ts-expect-error
                error?.extensions?.exception?.response?.message ||
                error?.message,
            };
            return graphQLFormattedError;
          }
          : (error: GraphQLError) => error,
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
