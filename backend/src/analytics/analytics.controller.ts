import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

// Importamos la seguridad
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('analytics')
@UseGuards(AuthGuard, RolesGuard) // Ponemos a los dos guardias en la puerta
@Roles('ADMIN') // Exigimos que la credencial diga "ADMIN"
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('dashboard')
  getDashboard() {
    return this.analyticsService.getDashboardStats();
  }


}

//Hola 

