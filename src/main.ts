import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  console.log(`서버가 실행 되었습니다. http://localhost:${PORT}`);
}
bootstrap();
