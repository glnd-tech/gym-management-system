import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { Workout } from './entities/workout.entity';

@Module({
  // 🛡️ AQUÍ ESTÁ LA SOLUCIÓN: Le damos acceso al Repository de Workout
  imports: [TypeOrmModule.forFeature([Workout])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
  exports: [WorkoutsService] // Exportamos para que Bookings pueda usarlo
})
export class WorkoutsModule { }