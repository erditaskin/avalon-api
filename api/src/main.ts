import { NestFactory } from '@nestjs/core';
import { CoreModule } from './core.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ImATeapotException, ValidationPipe } from '@nestjs/common';

const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://avalon-ui.vercel.app',
  'vercel.app',
  'avalon-ui.vercel.app',
];

async function bootstrap() {
  const app = await NestFactory.create(CoreModule, {
    cors: {
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
      origin: function (origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        if (
          whitelist.includes(origin) || // Checks your whitelist
          !!origin.match(/yourdomain\.com$/) // Overall check for your domain
        ) {
          console.log('allowed cors for:', origin);
          callback(null, true);
        } else {
          console.log('blocked cors for:', origin);
          callback(new ImATeapotException('Not allowed by CORS'), false);
        }
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
