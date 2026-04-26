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

  const allowedOrigins = new Set([
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
    'https://www.hotelix.xyz',
    'https://hotelix.xyz',
    'https://hotelix-one.vercel.app',
    process.env.CLIENT_URL,
  ].filter(Boolean) as string[]);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow same-origin/non-browser requests (no Origin header)
      if (!origin) return callback(null, true);

      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocalhost || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());  // ← add this
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
