import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        // 1. Leemos qué roles exige la ruta a la que intentan entrar
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no tiene el decorador @Roles, dejamos pasar a cualquiera
        if (!requiredRoles) {
            return true;
        }

        // 2. Obtenemos al usuario que está haciendo la petición (esto viene del Token JWT)
        const { user } = context.switchToHttp().getRequest();

        // 3. Verificamos si el usuario existe y si su rol está en la lista permitida
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Acceso denegado: Se requieren privilegios de Administrador.');
        }

        return true;
    }
}