import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { UsersService } from '../users/users.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    // Inyectamos a los compañeros de equipo que importaste en el módulo
    private usersService: UsersService,
    private subscriptionsService: SubscriptionsService,
  ) { }

  async create(createAttendanceDto: CreateAttendanceDto) {
    const { userId } = createAttendanceDto;

    // 1. ¿El usuario existe en la base de datos?
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Error en puerta: Usuario con ID ${userId} no existe.`);
    }

    // 2. ¿Tiene una membresía activa hoy?
    // Usamos el método que creamos en la clase pasada
    const activeSub = await this.subscriptionsService.findActiveByUserId(userId);

    if (!activeSub) {
      // Si no tiene, lanzamos error 403 y la puerta se queda bloqueada
      throw new ForbiddenException(
        `Acceso denegado: El usuario ${user.fullName} no tiene una membresía activa. Por favor pase por recepción.`
      );
    }

    // 3. ¡Todo en orden! Registramos la asistencia
    const newAttendance = this.attendanceRepository.create({
      user: user,
    });

    await this.attendanceRepository.save(newAttendance);

    // 4. Retornamos la orden para el hardware (torniquete) y la pantalla
    return {
      accessGranted: true,
      message: `¡Bienvenido al entrenamiento, ${user.fullName}!`,
      expiresOn: activeSub.endDate.toLocaleDateString()
    };
  }

  // Método para que el administrador vea el historial de entradas
  async findAll() {
    return await this.attendanceRepository.find({
      relations: ['user'], // Traemos los datos del usuario, no solo su ID
      order: { checkInTime: 'DESC' } // Los más recientes primero
    });
  }
}