import { Controller, Post, Body, Get } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) { }

  @Post()
  create(@Body() body: { userId: number; workoutId: number }) {
    // Le pasamos los dos IDs que vendrán en el JSON de Bruno
    return this.bookingsService.create(body.userId, body.workoutId);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }
}