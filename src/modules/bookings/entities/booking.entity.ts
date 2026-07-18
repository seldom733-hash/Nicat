import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BookingStatus } from '../../../common/constants';
import { User } from '../../users/entities/user.entity';
import { Tour } from '../../tours/entities/tour.entity';
import { Passenger } from './passenger.entity';
import { Payment } from '../../payments/entities/payment.entity';

@Entity('bookings')
@Index(['userId', 'status'])
@Index(['tourId', 'status'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  bookingReference: string;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => Tour, (tour) => tour.bookings)
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @Column({ type: 'uuid' })
  tourId: string;

  @Column({ type: 'int' })
  numberOfPassengers: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePricePerPerson: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  commissionRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  commissionAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalBasePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalCommission: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'date', nullable: true })
  tourDate: Date;

  @Column({ type: 'text', nullable: true })
  specialRequests: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @OneToMany(() => Passenger, (passenger) => passenger.booking, { cascade: true })
  passengers: Passenger[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeTransferId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
