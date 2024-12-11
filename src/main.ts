import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app';
import { ValidationPipe } from 'pipes/validation.pipe';

const DEFAULT_PORT = 5555;

async function start() {
  const PORT = process.env.PORT || DEFAULT_PORT;
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('keym test')
    .setDescription('keym test')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
