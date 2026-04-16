import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { User } from '../users/entities/user.entity';
import { Plan } from '../plans/entities/plan.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) { }

  async create(createSubDto: CreateSubscriptionDto) {
    const user = await this.userRepository.findOneBy({ id: createSubDto.userId });
    const plan = await this.planRepository.findOneBy({ id: createSubDto.planId });

    if (!user || !plan) {
      throw new NotFoundException('Usuario o Plan no encontrado');
    }

    const startDate = new Date();
    const endDate = new Date();
    // Sumamos los días del plan a la fecha actual
    endDate.setDate(startDate.getDate() + plan.durationDays);

    const newSub = this.subRepository.create({
      user,
      plan,
      startDate,
      endDate,
    });

    return await this.subRepository.save(newSub);
  }

  async findAll() {
    // Esto devuelve todas las suscripciones e incluye los datos del usuario y plan
    return await this.subRepository.find();
  }

  // ESTA ES LA FUNCIÓN QUE TE FALTABA Y CAUSA EL ERROR
  async findOne(id: number) {
    const sub = await this.subRepository.findOneBy({ id });
    if (!sub) throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
    return sub;
  }

  async findActiveByUserId(userId: number) {
    return await this.subRepository.findOne({
      where: {
        user: { id: userId },
        isActive: true,
      },
      order: { endDate: 'DESC' } // Trae la más reciente por si tiene varias
    });
  }

}