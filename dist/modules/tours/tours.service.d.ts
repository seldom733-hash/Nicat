import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { ItineraryItem } from './entities/itinerary-item.entity';
import { TourMedia } from './entities/tour-media.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
import { TourStatus } from '../../common/constants';
import { User } from '../users/entities/user.entity';
export declare class ToursService {
    private readonly tourRepository;
    private readonly itineraryRepository;
    private readonly mediaRepository;
    constructor(tourRepository: Repository<Tour>, itineraryRepository: Repository<ItineraryItem>, mediaRepository: Repository<TourMedia>);
    create(createTourDto: CreateTourDto, host: User): Promise<Tour>;
    findById(id: string): Promise<Tour>;
    findByHost(hostId: string, page?: number, limit?: number): Promise<{
        tours: Tour[];
        total: number;
    }>;
    update(id: string, updateTourDto: UpdateTourDto, userId?: string): Promise<Tour>;
    updateStatus(id: string, status: TourStatus, userId: string): Promise<Tour>;
    search(searchDto: SearchTourDto): Promise<{
        tours: Tour[];
        total: number;
    }>;
    getFeaturedTours(limit?: number): Promise<Tour[]>;
    incrementBookingCount(id: string): Promise<void>;
    remove(id: string, userId: string): Promise<void>;
}
