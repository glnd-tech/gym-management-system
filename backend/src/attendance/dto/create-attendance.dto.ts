import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;
}