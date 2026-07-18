import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Tour } from './tour.entity';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity('tour_media')
export class TourMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tour, (tour) => tour.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tourId' })
  tour: Tour;

  @Column({ type: 'uuid' })
  tourId: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
