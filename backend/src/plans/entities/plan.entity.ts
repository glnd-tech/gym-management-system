import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('plans')
export class Plan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Ejemplo: "Plan Estudiante", "Plan VIP"

    @Column('decimal', { precision: 10, scale: 2 })
    price: number; // Ejemplo: 250.00

    @Column()
    durationDays: number; // Ejemplo: 30 o 90 días

    @Column({ default: true })
    isActive: boolean;
}