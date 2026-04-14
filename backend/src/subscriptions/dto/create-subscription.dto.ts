import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubscriptionDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    planId: number;
}