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
import { TourStatus, TourCategory, DifficultyLevel } from '../../../common/constants';
import { User } from '../../users/entities/user.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { ItineraryItem } from './itinerary-item.entity';
import { TourMedia } from './tour-media.entity';

@Entity('tours')
@Index(['country', 'city'])
@Index(['category'])  @Index(['status'])
@Index(['startDate', 'endDate'])
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @ManyToOne(() => User, (user) => user.tours)
  @JoinColumn({ name: 'hostId' })
  host: User;

  @Column({ type: 'uuid' })
  hostId: string;

  @Column({ type: 'varchar', length: 100 })
  country: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({
    type: 'enum',
    enum: TourCategory,
    default: TourCategory.CULTURAL,
  })
  category: TourCategory;

  @Column({
    type: 'enum',
    enum: DifficultyLevel,
    default: DifficultyLevel.MODERATE,
  })
  difficulty: DifficultyLevel;

  @Column({ type: 'varchar', length: 50, default: 'en' })
  language: string;

  @Column({ type: 'int', default: 1 })
  minGroupSize: number;

  @Column({ type: 'int', default: 20 })
  maxGroupSize: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15 })
  commissionRate: number;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ type: 'int' })
  durationDays: number;

  @Column({
    type: 'enum',
    enum: TourStatus,
    default: TourStatus.DRAFT,
  })
  status: TourStatus;

  @Column({ type: 'boolean', default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  bookingCount: number;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  averageRating: number;

  @Column({ type: 'int', default: 0 })
  reviewCount: number;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  services: string[];

  @OneToMany(() => ItineraryItem, (item) => item.tour, { cascade: true })
  itinerary: ItineraryItem[];

  @OneToMany(() => TourMedia, (media) => media.tour, { cascade: true })
  media: TourMedia[];

  @OneToMany(() => Booking, (booking) => booking.tour)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
