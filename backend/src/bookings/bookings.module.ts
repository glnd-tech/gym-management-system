import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';

// Importamos a los compañeros de equipo para las reglas de negocio
import { UsersModule } from '../users/users.module';
import { WorkoutsModule } from '../workouts/workouts.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    // 🛡️ Le damos acceso al Repository de Booking
    TypeOrmModule.forFeature([Booking]),
    UsersModule,
    WorkoutsModule,
    SubscriptionsModule
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule { }