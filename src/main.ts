import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });  
  app.useGlobalPipes(new ValidationPipe());
    
  // get port from config service which gets from .env file
  const configService = app.get(ConfigService)
  const port = configService.get<number>('APPLICATION_PORT')
  const appName = configService.get<string>('APPLICATION_NAME')
  
  // add Global prefix
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port)
  Logger.log(`${appName} is listening on port(🚀): ${port}`);
}
bootstrap();
