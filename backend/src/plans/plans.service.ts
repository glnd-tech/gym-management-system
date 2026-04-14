import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <-- Corregido aquí
import { Repository } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from './entities/plan.entity';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) { }

  async create(createPlanDto: CreatePlanDto) {
    const newPlan = this.plansRepository.create(createPlanDto);
    return await this.plansRepository.save(newPlan);
  }

  async findAll() {
    return await this.plansRepository.find({ where: { isActive: true } });
  }

  async findOne(id: number) {
    const plan = await this.plansRepository.findOneBy({ id });
    if (!plan) throw new NotFoundException(`Plan con ID ${id} no encontrado`);
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);
    const updatedPlan = this.plansRepository.merge(plan, updatePlanDto);
    return await this.plansRepository.save(updatedPlan);
  }

  async remove(id: number) {
    const plan = await this.findOne(id);
    return await this.plansRepository.remove(plan);
  }
}