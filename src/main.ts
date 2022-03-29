import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidateAuthMiddleware } from './core/middlewares/validate-auth.middleware';
import { setupSwagger } from './open-api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalPipes(new ValidateAuthMiddleware());
  await app.listen(5001);
}
//donasrte
bootstrap();
