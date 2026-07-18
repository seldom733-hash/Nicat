import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../../../common/constants';
import { Exclude } from 'class-transformer';
import { Tour } from '../../tours/entities/tour.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TRAVELER,
  })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  language: string;

  @Column({ type: 'boolean', default: false })
  isEmailVerified: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Exclude()
  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshToken: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  stripeAccountId: string;

  @Column({ type: 'boolean', default: false })
  isStripeConnected: boolean;

  // Passport data - encrypted at application level
  @Exclude()
  @Column({ type: 'text', nullable: true })
  passportData: string;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  passportEncryptionIV: string;

  @Exclude()
  @Column({ type: 'text', nullable: true })
  passportEncryptionKey: string;

  @OneToMany(() => Tour, (tour) => tour.host)
  tours: Tour[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
