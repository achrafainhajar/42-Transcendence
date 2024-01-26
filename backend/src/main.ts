import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import { PrismaClientExceptionFilter } from 'src/prisma/prisma-client-exception.filter';
import { HeaderAlreadySentExceptionFilter } from 'src/auth/test.filter';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:' + process.env.PORT],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  //  app.useStaticAssets(join(__dirname,'..','..', 'uploads'));
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));
  const config = new DocumentBuilder()
    .setTitle('PingBall API')
    .setDescription('The PingBall API 1337')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const { httpAdapter } = app.get(HttpAdapterHost);
//  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  // app.useGlobalFilters(new HeaderAlreadySentExceptionFilter(httpAdapter));
  await app.listen(process.env.PORT, async () => {
    console.log(`Application is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
