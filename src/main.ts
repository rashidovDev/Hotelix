import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.use(graphqlUploadExpress({
    maxFileSize: 5_000_000,  // 5mb
    maxFiles: 10,
  }));

  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
