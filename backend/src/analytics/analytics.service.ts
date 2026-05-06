import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Subscription) private subRepository: Repository<Subscription>,
        @InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>,
    ) { }

    async getDashboardStats() {
        // 1. Total de clientes registrados en el sistema
        const totalUsers = await this.userRepository.count();

        // 2. Termómetro del día: ¿Cuántas personas pasaron por el torniquete hoy?
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Fijamos la hora a las 00:00:00 de hoy

        const checkInsToday = await this.attendanceRepository
            .createQueryBuilder('attendance')
            .where('attendance.checkInTime >= :today', { today })
            .getCount();

        // 3. Proyección Financiera: Dinero que están generando las suscripciones activas
        // (Cruzamos la tabla Suscripción con la tabla Plan para poder sumar el 'price')
        const revenueResult = await this.subRepository
            .createQueryBuilder('subscription')
            .leftJoin('subscription.plan', 'plan')
            .where('subscription.isActive = :active', { active: true })
            .select('SUM(plan.price)', 'totalRevenue')
            .getRawOne();

        // Convertimos el resultado a número (o a 0 si no hay ingresos aún)
        const activeRevenue = revenueResult.totalRevenue ? parseFloat(revenueResult.totalRevenue) : 0;

        return {
            kpis: {
                totalUsers,
                checkInsToday,
                activeRevenue
            },
            message: 'Reporte generado con éxito'
        };
    }
}