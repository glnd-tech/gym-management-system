import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // <-- Importa esto
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Esta línea es el filtro que detendrá datos basura
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


// Antes de ejecutar los comandos se debe estar en la carpeta backend.
// cd backend

// Encendido de la base de datos (Docker)
// docker compose up -d

// Encendido del servidor (NestJS)
// npm run start:dev
