import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('No se envió un token de autenticación válido.');
        }

        try {
            // Verificamos el token (NestJS usa el secreto que ya configuraste en tu AuthModule)
            const payload = await this.jwtService.verifyAsync(token);

            // 💡 LA MAGIA OCURRE AQUÍ: Guardamos los datos decodificados (id, email, role) 
            // dentro de la petición para que el RolesGuard los pueda leer un milisegundo después.
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Token inválido o expirado.');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}