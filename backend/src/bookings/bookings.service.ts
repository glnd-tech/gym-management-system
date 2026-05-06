import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

// Importamos los servicios compañeros
import { UsersService } from '../users/users.service';
import { WorkoutsService } from '../workouts/workouts.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private usersService: UsersService,
    private workoutsService: WorkoutsService,
    private subscriptionsService: SubscriptionsService,
  ) { }

  // En lugar de usar un DTO aquí, recibimos los IDs directamente para simplificar
  async create(userId: number, workoutId: number) {
    // 1. ¿El usuario existe?
    const user = await this.usersService.findOne(userId);

    // 2. ¿Tiene una membresía activa hoy?
    const activeSub = await this.subscriptionsService.findActiveByUserId(userId);
    if (!activeSub) {
      throw new ForbiddenException('Necesitas una membresía activa para reservar clases.');
    }

    // 3. ¿La clase existe? (Recordemos que esto también trae a los inscritos actuales)
    const workout = await this.workoutsService.findOne(workoutId);

    // 4. ¿La clase ya pasó?
    if (new Date(workout.scheduledAt) < new Date()) {
      throw new BadRequestException('Esta clase ya empezó o ya terminó, no puedes reservar.');
    }

    // 5. ¿Hay cupos disponibles?
    // Si bookings existe, vemos cuántos hay. Si hay más o igual a la capacidad = Lleno.
    const currentBookings = workout.bookings ? workout.bookings.length : 0;
    if (currentBookings >= workout.capacity) {
      throw new BadRequestException(`Lo sentimos, la clase de ${workout.name} ya está llena.`);
    }

    // 6. ¿El usuario ya reservó esta misma clase antes?
    const existingBooking = await this.bookingsRepository.findOne({
      where: { user: { id: userId }, workout: { id: workoutId } }
    });

    if (existingBooking) {
      throw new BadRequestException('Ya tienes tu cupo asegurado para esta clase.');
    }

    // 7. ¡Todo perfecto! Anotamos al usuario en la clase
    const newBooking = this.bookingsRepository.create({
      user: user,
      workout: workout
    });

    await this.bookingsRepository.save(newBooking);

    return {
      message: `¡Reserva confirmada! Nos vemos en ${workout.name}.`,
      cuposRestantes: workout.capacity - (currentBookings + 1)
    };
  }

  async findAll() {
    return await this.bookingsRepository.find({ relations: ['user', 'workout'] });
  }
}