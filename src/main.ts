import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './logger/winston.logger';
import { WinstonModule } from 'nest-winston';
import { HttpExceptionFilter } from './common/http.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: logger,
    }),
  });
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('The APIs for a ecommerce app ')
    .addBearerAuth() //adds bearer auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //setting whitelist true filters the unwanted body properties
  const httpExceptionFilter = app.get<HttpExceptionFilter>(HttpExceptionFilter);
  app.useGlobalFilters(httpExceptionFilter);

  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  await app.listen(PORT);
  logger.info(`Server is running at http://localhost:${PORT}/`);
  logger.info(`For API documentation: http://localhost:${PORT}/api/docs`);
}
bootstrap().catch((error) => {
  logger.error('Error:', error || error.message);
});
