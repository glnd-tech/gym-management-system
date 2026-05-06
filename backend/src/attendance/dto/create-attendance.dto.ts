import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateAttendanceDto {
    @IsNotEmpty({ message: 'El ID del usuario es obligatorio para abrir la puerta' })
    @IsInt({ message: 'El ID debe ser un número entero' })
    @Min(1)
    userId: number;
}