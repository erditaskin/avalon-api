import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: function (origin, callback) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      },
    },
  });
  const port: number = 3000;

  const documentConfig = new DocumentBuilder()
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    console.log('Listening to ', `http://localhost:${port}`);
  });
}
bootstrap();
