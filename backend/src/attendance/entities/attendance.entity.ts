import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // Ajusta la ruta si es necesario

@Entity('attendances')
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    // TypeORM llenará este campo automáticamente con la fecha y hora del sistema al instante de entrar
    @CreateDateColumn()
    checkInTime: Date;

    // Relación: Muchas asistencias pueden pertenecer a un solo Usuario
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;
}