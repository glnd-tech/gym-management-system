import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance') // Asegúrate de que la ruta sea 'attendance'
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  // Este es el endpoint al que "llamará" el aparato de la puerta
  @Post('check-in')
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  // Endpoint para los reportes
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }
}