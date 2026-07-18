import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { PaymentStatus } from '../../../common/constants';
import { Booking } from '../../bookings/entities/booking.entity';
import { User } from '../../users/entities/user.entity';

@Entity('payments')
@Index(['bookingId', 'status'])
@Index(['stripePaymentIntentId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ type: 'uuid' })
  bookingId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'payerId' })
  payer: User;

  @Column({ type: 'uuid' })
  payerId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripePaymentIntentId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeChargeId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeTransferId: string;

  @Column({ type: 'text', nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  refundedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
