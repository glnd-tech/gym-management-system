import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('subscriptions')
export class Subscription {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;

    // Relaciones
    @ManyToOne(() => User, (user) => user.id, { eager: true })
    user: User;

    @ManyToOne(() => Plan, (plan) => plan.id, { eager: true })
    plan: Plan;
}