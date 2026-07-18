import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from './booking.entity';

@Entity('passengers')
export class Passenger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, (booking) => booking.passengers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column({ type: 'uuid' })
  bookingId: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'varchar', length: 50 })
  nationality: string;

  // Encrypted passport data
  @Column({ type: 'text', nullable: true })
  passportNumber: string;

  @Column({ type: 'date', nullable: true })
  passportExpiry: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  passportCountry: string;

  // Emergency contact
  @Column({ type: 'varchar', length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone: string;

  // Dietary and medical
  @Column({ type: 'text', nullable: true })
  dietaryRequirements: string;

  @Column({ type: 'text', nullable: true })
  medicalConditions: string;

  @Column({ type: 'boolean', default: false })
  isLeadPassenger: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;
}
