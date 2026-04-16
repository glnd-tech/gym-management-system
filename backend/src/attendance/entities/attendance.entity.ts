import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    checkInTime: Date; // Guarda automáticamente la fecha y hora exacta del escaneo

    // Relación: Muchas asistencias pertenecen a un solo usuario
    @ManyToOne(() => User, (user) => user.id, { eager: true })
    user: User;
}