import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tour } from './tour.entity';

@Entity('itinerary_items')
export class ItineraryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tour, (tour) => tour.itinerary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @Column({ type: 'uuid' })
  tourId: string;

  @Column({ type: 'int' })
  dayNumber: number;

  @Column({ type: 'int' })
  sortOrder: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  startTime: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  endTime: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
