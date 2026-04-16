import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    private subscriptionsService: SubscriptionsService,
  ) { }

  async checkIn(createAttendanceDto: CreateAttendanceDto) {
    // 1. Buscar la suscripción activa del usuario
    const activeSub = await this.subscriptionsService.findActiveByUserId(createAttendanceDto.userId);

    // 2. Si no tiene suscripción, no entra
    if (!activeSub) {
      throw new ForbiddenException('Acceso denegado: No tienes una membresía registrada en el gimnasio.');
    }

    // 3. Verificar que la fecha de hoy no sea mayor a la fecha de vencimiento
    const hoy = new Date();
    if (hoy > activeSub.endDate) {
      throw new ForbiddenException(`Acceso denegado: Tu membresía venció el ${activeSub.endDate.toLocaleDateString()}`);
    }

    // 4. Si todo está en orden, registramos la entrada
    const newAttendance = this.attendanceRepository.create({
      user: { id: createAttendanceDto.userId },
    });

    const savedAttendance = await this.attendanceRepository.save(newAttendance);

    return {
      message: '¡Bienvenido al gimnasio! Entrada registrada exitosamente.',
      checkInTime: savedAttendance.checkInTime,
    };
  }
}