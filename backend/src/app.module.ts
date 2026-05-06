import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PlansModule } from './plans/plans.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';

// 🚀 NUEVO: Importamos los módulos de Clases y Reservas
import { WorkoutsModule } from './workouts/workouts.module';
import { BookingsModule } from './bookings/bookings.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // 1. Cargar las variables del .env
    ConfigModule.forRoot(),

    // 2. Conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5433', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // Sincroniza las tablas automáticamente en modo desarrollo
    }),

    UsersModule,
    PlansModule,
    SubscriptionsModule,
    AuthModule,
    AttendanceModule,

    // 🚀 NUEVO: Registramos los módulos para que NestJS exponga sus rutas
    WorkoutsModule,
    BookingsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }