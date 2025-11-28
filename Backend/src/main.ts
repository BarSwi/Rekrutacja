import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/errors/all-exception-filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
