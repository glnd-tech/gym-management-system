import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre del plan es obligatorio' })
    name: string;

    @IsNumber()
    @Min(0, { message: 'El precio no puede ser negativo' })
    price: number;

    @IsNumber()
    @Min(1, { message: 'La duración debe ser de al menos 1 día' })
    durationDays: number;
}