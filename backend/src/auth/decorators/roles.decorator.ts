import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Esta función nos permitirá poner @Roles('ADMIN') encima de nuestras rutas
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);