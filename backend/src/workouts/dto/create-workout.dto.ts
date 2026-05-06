import { IsString, IsInt, IsDateString, Min, IsNotEmpty } from 'class-validator';

export class CreateWorkoutDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    // IsDateString asegura que enviemos un formato de fecha válido (Ej: 2026-05-01T18:00:00Z)
    @IsNotEmpty()
    @IsDateString()
    scheduledAt: Date;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: 'La clase debe tener al menos 1 cupo' })
    capacity: number;
}