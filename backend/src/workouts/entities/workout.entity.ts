import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('workouts')
export class Workout {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Ej: 'Zumba Masterclass'

    @Column()
    description: string;

    @Column({ type: 'timestamp' })
    scheduledAt: Date; // Fecha y hora exacta de la clase

    @Column()
    capacity: number; // Límite de personas

    // Relación: Un entrenamiento puede tener muchas reservas
    @OneToMany(() => Booking, (booking) => booking.workout)
    bookings: Booking[];
}