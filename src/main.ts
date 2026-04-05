import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.use(graphqlUploadExpress({
    maxFileSize: 5_000_000,  // 5mb
    maxFiles: 10,
  }));

  app.enableCors({
  origin: ['http://localhost:5001', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

  app.use(cookieParser());  // ← add this
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
