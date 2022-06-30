import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { validate } from './configs/env.validation';
import { DatabaseModule } from './database/database.module';
import { ResponseProvider } from './providers/ResponseProvider';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate
    }),
    DatabaseModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [ResponseProvider],
})
export class AppModule { }
