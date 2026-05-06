import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Workout } from '../../workouts/entities/workout.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    // Cuándo se hizo el clic en "Reservar"
    @CreateDateColumn()
    bookedAt: Date;

    // ¿Quién reservó?
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    // ¿Qué clase reservó? Aquí está la propiedad "workout" que TypeScript estaba buscando
    @ManyToOne(() => Workout, (workout) => workout.bookings)
    @JoinColumn({ name: 'workoutId' })
    workout: Workout;
}