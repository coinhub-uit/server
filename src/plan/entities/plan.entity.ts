import { InterestRateEntity } from 'src/plan/interest_rate/entities/interest_rate.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plan')
export class PlanEntity {
  @PrimaryGeneratedColumn('increment')
  planId: number;

  @Column({ type: 'enum', unique: true })
  days: -1 | 90 | 180;

  @Column()
  isDisabled: boolean;

  @OneToMany(() => InterestRateEntity, (interestRate) => interestRate.plan)
  interestRates: InterestRateEntity[];
}
