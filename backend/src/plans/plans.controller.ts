import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

// 🛡️ Importamos nuestras herramientas de seguridad
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard'; // (Si usas Passport, esto sería import { AuthGuard } from '@nestjs/passport')

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard) // 1. Ponemos a los guardias en la puerta
  @Roles('ADMIN')                   // 2. Les damos la instrucción: "Solo ADMIN"
  create(@Body() createPlanDto: CreatePlanDto) {
    // Recibe los datos validados del DTO y los manda al servicio
    return this.plansService.create(createPlanDto);
  }

  @Get()
  findAll() {
    // Devuelve todos los planes activos para mostrar en el gimnasio
    return this.plansService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard) // Protegemos también la actualización
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard) // Protegemos también la eliminación
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.remove(id);
  }
}