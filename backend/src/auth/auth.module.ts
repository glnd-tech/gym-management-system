import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module'; // <-- Importamos los usuarios
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UsersModule, // Conectamos el módulo
    JwtModule.register({
      global: true, // Hace que el JWT funcione en todo el sistema
      secret: 'MI_PALABRA_SECRETA_PARA_EL_GIMNASIO', // En la vida real, esto va en un archivo .env
      signOptions: { expiresIn: '1d' }, // El token (la sesión) durará 1 día
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }