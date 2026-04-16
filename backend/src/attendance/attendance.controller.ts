import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  // Esta ruta será POST http://localhost:3000/attendance/check-in
  @Post('check-in')
  checkIn(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.checkIn(createAttendanceDto);
  }
}