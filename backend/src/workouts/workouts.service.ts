import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { Workout } from './entities/workout.entity';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepository: Repository<Workout>,
  ) { }

  async create(createWorkoutDto: CreateWorkoutDto) {
    const newWorkout = this.workoutsRepository.create(createWorkoutDto);
    return await this.workoutsRepository.save(newWorkout);
  }

  async findAll() {
    return await this.workoutsRepository.find();
  }

  // 🛡️ El método clave: Trae la clase Y a los inscritos
  async findOne(id: number) {
    const workout = await this.workoutsRepository.findOne({
      where: { id },
      relations: ['bookings'] // <-- MAGIA: Traemos la lista de reservas
    });

    if (!workout) {
      throw new NotFoundException(`Clase con ID ${id} no encontrada`);
    }
    return workout;
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    return `This action updates a #${id} workout`; // Por ahora lo dejamos por defecto
  }

  async remove(id: number) {
    return `This action removes a #${id} workout`; // Por ahora lo dejamos por defecto
  }
}