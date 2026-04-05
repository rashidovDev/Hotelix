import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { GatewayModule } from './gateway/gateway.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
  GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
  playground: {
    settings: {
      'request.credentials': 'include',   // ← must be include
      'editor.theme': 'dark',
    },
  },
  context: ({ req, res }) => ({ req, res }),
}),
    PrismaModule,
    AuthModule,
    UsersModule,
    HotelsModule,
    RoomsModule,
    BookingsModule,
    ReviewsModule,
    GatewayModule,
    UploadModule,
  ],
})
export class AppModule {}