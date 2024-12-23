import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from 'app';
import { ROUTES } from 'constants/routes.enum';

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
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(ROUTES.SWAGGER, app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
