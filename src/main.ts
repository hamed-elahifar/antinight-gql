////////////*******بسم الله الرحمن الرحیم*******////////////
////////////************یا هو*********////////////

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { altairExpress } from 'altair-express-middleware';


async function bootstrap() {
  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port: number = +configService.getOrThrow<number>('PORT');

    // configure the Altair web-based client/playground
    app.use(
      '/graphql',
      altairExpress({
        endpointURL: '/graphql',
        subscriptionsEndpoint: '/graphql',
        subscriptionsProtocol: 'ws',
        initialSettings: {
          'theme.editorFontFamily':
            "'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace",
          'theme.fontsize': 24,
          theme: 'dark',
          enableExperimental: false,
          'request.withCredentials': true,
        },
      }),
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port, async () => {
    logger.log(`App Running On Port: ${await app.getUrl()}`);
    logger.log(`START`);
  });
}
bootstrap();
