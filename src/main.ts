import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  const config = new DocumentBuilder()
    .setTitle('User')
    .setDescription('The ')
    .addBearerAuth() //adds bearer auth
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); //setting whitelist true filters the unwanted body properties
  await app.listen(PORT);
}
bootstrap().then(() => {
  console.log(`Server Started at localhost:3000`);
});
