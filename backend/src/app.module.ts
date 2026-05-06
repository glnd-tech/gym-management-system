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
import { WorkoutsModule } from './workouts/workouts.module';
import { BookingsModule } from './bookings/bookings.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    // 1. Cargar las variables del .env
    ConfigModule.forRoot(),

    // 2. Conexión a la base de datos en la Nube (Neon)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // Lee la URL completa
      autoLoadEntities: true,
      synchronize: true, // Sincroniza las tablas en la nube
      ssl: true, // Requerido por Neon
      extra: {
        ssl: {
          rejectUnauthorized: false, // Evita bloqueos de certificados
        },
      },
    }),

    // 3. Módulos del sistema
    UsersModule,
    PlansModule,
    SubscriptionsModule,
    AuthModule,
    AttendanceModule,
    WorkoutsModule,
    BookingsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }