import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  //Global Pipe: Pipe ini akan dijalankan secara otomatis untuk setiap request yang masuk ke aplikasi
  // tanpa perlu menambahkannya secara manual pada setiap route atau controller.
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  
  const port = 3000;
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Application listening on port ${port}`);

}
bootstrap();
