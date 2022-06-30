import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ResponseProvider } from '../providers/ResponseProvider';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [ 
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_ENCRYPTION'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') },
      }),
      inject: [ConfigService],
  })
  ],
  controllers: [UsersController],
  providers: [UsersService, ResponseProvider],
})

export class UsersModule implements NestModule { 
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)      
      .forRoutes({ path: 'users/profile', method: RequestMethod.GET });
  }
}
