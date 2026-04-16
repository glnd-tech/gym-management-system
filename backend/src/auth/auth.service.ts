import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        // 1. Buscar al usuario por el correo que envió
        const user = await this.usersService.findOneByEmail(loginDto.email);

        // Si no existe, lanzamos error 401 (No Autorizado)
        if (!user) {
            throw new UnauthorizedException('Correo o contraseña incorrectos');
        }

        // 2. Comparar la contraseña plana con el hash de la base de datos
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Correo o contraseña incorrectos'); // Damos el mismo error por seguridad
        }

        // 3. Generar el Token JWT (La Manilla VIP)
        // Guardamos el ID del usuario en 'sub' (subject), es el estándar
        const payload = { sub: user.id, email: user.email };

        return {
            message: 'Login exitoso',
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                fullName: user.fullName
            }
        };
    }
}