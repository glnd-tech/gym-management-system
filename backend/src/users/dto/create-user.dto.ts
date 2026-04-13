import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
    fullName: string;

    @IsEmail({}, { message: 'El formato del correo es inválido' })
    email: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;
}