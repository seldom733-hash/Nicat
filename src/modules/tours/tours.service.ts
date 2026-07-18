import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tour } from './entities/tour.entity';
import { ItineraryItem } from './entities/itinerary-item.entity';
import { TourMedia } from './entities/tour-media.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
import { TourStatus } from '../../common/constants';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(Tour)
    private readonly tourRepository: Repository<Tour>,
    @InjectRepository(ItineraryItem)
    private readonly itineraryRepository: Repository<ItineraryItem>,
    @InjectRepository(TourMedia)
    private readonly mediaRepository: Repository<TourMedia>,
  ) {}

  async create(createTourDto: CreateTourDto, host: User): Promise<Tour> {
    const { itinerary, media, ...tourData } = createTourDto;

    const tour = this.tourRepository.create({
      ...tourData,
      hostId: host.id,
      status: TourStatus.DRAFT,
    });

    const savedTour = await this.tourRepository.save(tour);

    if (itinerary && itinerary.length > 0) {
      const itineraryItems = itinerary.map((item) =>
        this.itineraryRepository.create({
          ...item,
          tourId: savedTour.id,
        }),
      );
      await this.itineraryRepository.save(itineraryItems);
    }

    if (media && media.length > 0) {
      const mediaItems = media.map((item) =>
        this.mediaRepository.create({
          ...item,
          tourId: savedTour.id,
        }),
      );
      await this.mediaRepository.save(mediaItems);
    }

    return this.findById(savedTour.id);
  }

  async findById(id: string): Promise<Tour> {
    const tour = await this.tourRepository.findOne({
      where: { id },
      relations: { host: true, itinerary: true, media: true },
    });
    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return tour;
  }

  async findByHost(hostId: string, page = 1, limit = 10): Promise<{ tours: Tour[]; total: number }> {
    const [tours, total] = await this.tourRepository.findAndCount({
      where: { hostId },
      relations: { itinerary: true, media: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { tours, total };
  }

  async update(id: string, updateTourDto: UpdateTourDto, userId?: string): Promise<Tour> {
    const tour = await this.findById(id);

    if (userId && tour.hostId !== userId) {
      throw new ForbiddenException('You can only update your own tours');
    }

    const { itinerary, media, ...tourData } = updateTourDto;

    Object.assign(tour, tourData);
    await this.tourRepository.save(tour);

    if (itinerary) {
      await this.itineraryRepository.delete({ tourId: id });
      if (itinerary.length > 0) {
        const itineraryItems = itinerary.map((item) =>
          this.itineraryRepository.create({
            ...item,
            tourId: id,
          }),
        );
        await this.itineraryRepository.save(itineraryItems);
      }
    }

    if (media) {
      await this.mediaRepository.delete({ tourId: id });
      if (media.length > 0) {
        const mediaItems = media.map((item) =>
          this.mediaRepository.create({
            ...item,
            tourId: id,
          }),
        );
        await this.mediaRepository.save(mediaItems);
      }
    }

    return this.findById(id);
  }

  async updateStatus(id: string, status: TourStatus, userId: string): Promise<Tour> {
    const tour = await this.findById(id);

    if (tour.hostId !== userId) {
      throw new ForbiddenException('You can only update your own tours');
    }

    tour.status = status;
    return this.tourRepository.save(tour);
  }

  async search(searchDto: SearchTourDto): Promise<{ tours: Tour[]; total: number }> {
    const query = this.tourRepository.createQueryBuilder('tour');
    query.leftJoinAndSelect('tour.host', 'host');
    query.leftJoinAndSelect('tour.media', 'media');

    query.where('tour.status = :status', { status: TourStatus.ACTIVE });

    if (searchDto.q) {
      query.andWhere(
        '(tour.title ILIKE :q OR tour.city ILIKE :q OR tour.country ILIKE :q OR tour.description ILIKE :q)',
        { q: `%${searchDto.q}%` },
      );
    }

    // Support both single country/city and multi-select (comma-separated)
    if (searchDto.countries) {
      const countryList = searchDto.countries.split(',').map(s => s.trim()).filter(s => s);
      if (countryList.length > 0) {
        query.andWhere('tour.country IN (:...countryList)', { countryList });
      }
    } else if (searchDto.country) {
      query.andWhere('tour.country = :country', { country: searchDto.country });
    }

    if (searchDto.cities) {
      const cityList = searchDto.cities.split(',').map(s => s.trim()).filter(s => s);
      if (cityList.length > 0) {
        query.andWhere('tour.city IN (:...cityList)', { cityList });
      }
    } else if (searchDto.city) {
      query.andWhere('tour.city = :city', { city: searchDto.city });
    }

    if (searchDto.category) {
      query.andWhere('tour.category = :category', { category: searchDto.category });
    }

    if (searchDto.minPrice !== undefined) {
      query.andWhere('tour.basePrice >= :minPrice', { minPrice: searchDto.minPrice });
    }

    if (searchDto.maxPrice !== undefined) {
      query.andWhere('tour.basePrice <= :maxPrice', { maxPrice: searchDto.maxPrice });
    }

    if (searchDto.durationDays) {
      query.andWhere('tour.durationDays = :durationDays', { durationDays: searchDto.durationDays });
    }

    if (searchDto.minDuration !== undefined) {
      query.andWhere('tour.durationDays >= :minDuration', { minDuration: searchDto.minDuration });
    }

    if (searchDto.maxDuration !== undefined) {
      query.andWhere('tour.durationDays <= :maxDuration', { maxDuration: searchDto.maxDuration });
    }

    if (searchDto.language) {
      query.andWhere('tour.language = :language', { language: searchDto.language });
    }

    if (searchDto.startDate) {
      query.andWhere('tour.startDate >= :startDate', { startDate: searchDto.startDate });
    }

    if (searchDto.endDate) {
      query.andWhere('tour.endDate <= :endDate', { endDate: searchDto.endDate });
    }

    if (searchDto.services) {
      const serviceIds = searchDto.services.split(',').map(s => s.trim()).filter(s => s);
      if (serviceIds.length > 0) {
        query.andWhere('tour.services IS NOT NULL');
        // Check that tour.services contains ALL selected services
        query.andWhere('tour.services @> :serviceJson', {
          serviceJson: JSON.stringify(serviceIds),
        });
      }
    }

    const page = searchDto.page || 1;
    const limit = searchDto.limit || 10;
    const sortBy = searchDto.sortBy || 'createdAt';
    const sortOrder = searchDto.sortOrder || 'DESC';

    query.orderBy(`tour.${sortBy}`, sortOrder);
    query.skip((page - 1) * limit);
    query.take(limit);

    const [tours, total] = await query.getManyAndCount();
    return { tours, total };
  }

  async getFeaturedTours(limit = 10): Promise<Tour[]> {
    return this.tourRepository.find({
      where: { isFeatured: true, status: TourStatus.ACTIVE },
      relations: { host: true, media: true },
      take: limit,
      order: { bookingCount: 'DESC' },
    });
  }

  async incrementBookingCount(id: string): Promise<void> {
    await this.tourRepository.increment({ id }, 'bookingCount', 1);
  }

  async remove(id: string, userId: string): Promise<void> {
    const tour = await this.findById(id);

    if (tour.hostId !== userId) {
      throw new ForbiddenException('You can only delete your own tours');
    }

    await this.tourRepository.remove(tour);
  }
}
