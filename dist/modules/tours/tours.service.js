"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tour_entity_1 = require("./entities/tour.entity");
const itinerary_item_entity_1 = require("./entities/itinerary-item.entity");
const tour_media_entity_1 = require("./entities/tour-media.entity");
const constants_1 = require("../../common/constants");
let ToursService = class ToursService {
    tourRepository;
    itineraryRepository;
    mediaRepository;
    constructor(tourRepository, itineraryRepository, mediaRepository) {
        this.tourRepository = tourRepository;
        this.itineraryRepository = itineraryRepository;
        this.mediaRepository = mediaRepository;
    }
    async create(createTourDto, host) {
        const { itinerary, media, ...tourData } = createTourDto;
        const tour = this.tourRepository.create({
            ...tourData,
            hostId: host.id,
            status: constants_1.TourStatus.DRAFT,
        });
        const savedTour = await this.tourRepository.save(tour);
        if (itinerary && itinerary.length > 0) {
            const itineraryItems = itinerary.map((item) => this.itineraryRepository.create({
                ...item,
                tourId: savedTour.id,
            }));
            await this.itineraryRepository.save(itineraryItems);
        }
        if (media && media.length > 0) {
            const mediaItems = media.map((item) => this.mediaRepository.create({
                ...item,
                tourId: savedTour.id,
            }));
            await this.mediaRepository.save(mediaItems);
        }
        return this.findById(savedTour.id);
    }
    async findById(id) {
        const tour = await this.tourRepository.findOne({
            where: { id },
            relations: { host: true, itinerary: true, media: true },
        });
        if (!tour) {
            throw new common_1.NotFoundException('Tour not found');
        }
        return tour;
    }
    async findByHost(hostId, page = 1, limit = 10) {
        const [tours, total] = await this.tourRepository.findAndCount({
            where: { hostId },
            relations: { itinerary: true, media: true },
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { tours, total };
    }
    async update(id, updateTourDto, userId) {
        const tour = await this.findById(id);
        if (userId && tour.hostId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own tours');
        }
        const { itinerary, media, ...tourData } = updateTourDto;
        Object.assign(tour, tourData);
        await this.tourRepository.save(tour);
        if (itinerary) {
            await this.itineraryRepository.delete({ tourId: id });
            if (itinerary.length > 0) {
                const itineraryItems = itinerary.map((item) => this.itineraryRepository.create({
                    ...item,
                    tourId: id,
                }));
                await this.itineraryRepository.save(itineraryItems);
            }
        }
        if (media) {
            await this.mediaRepository.delete({ tourId: id });
            if (media.length > 0) {
                const mediaItems = media.map((item) => this.mediaRepository.create({
                    ...item,
                    tourId: id,
                }));
                await this.mediaRepository.save(mediaItems);
            }
        }
        return this.findById(id);
    }
    async updateStatus(id, status, userId) {
        const tour = await this.findById(id);
        if (tour.hostId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own tours');
        }
        tour.status = status;
        return this.tourRepository.save(tour);
    }
    async search(searchDto) {
        const query = this.tourRepository.createQueryBuilder('tour');
        query.leftJoinAndSelect('tour.host', 'host');
        query.leftJoinAndSelect('tour.media', 'media');
        query.where('tour.status = :status', { status: constants_1.TourStatus.ACTIVE });
        if (searchDto.q) {
            query.andWhere('(tour.title ILIKE :q OR tour.city ILIKE :q OR tour.country ILIKE :q OR tour.description ILIKE :q)', { q: `%${searchDto.q}%` });
        }
        if (searchDto.countries) {
            const countryList = searchDto.countries.split(',').map(s => s.trim()).filter(s => s);
            if (countryList.length > 0) {
                query.andWhere('tour.country IN (:...countryList)', { countryList });
            }
        }
        else if (searchDto.country) {
            query.andWhere('tour.country = :country', { country: searchDto.country });
        }
        if (searchDto.cities) {
            const cityList = searchDto.cities.split(',').map(s => s.trim()).filter(s => s);
            if (cityList.length > 0) {
                query.andWhere('tour.city IN (:...cityList)', { cityList });
            }
        }
        else if (searchDto.city) {
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
    async getFeaturedTours(limit = 10) {
        return this.tourRepository.find({
            where: { isFeatured: true, status: constants_1.TourStatus.ACTIVE },
            relations: { host: true, media: true },
            take: limit,
            order: { bookingCount: 'DESC' },
        });
    }
    async incrementBookingCount(id) {
        await this.tourRepository.increment({ id }, 'bookingCount', 1);
    }
    async remove(id, userId) {
        const tour = await this.findById(id);
        if (tour.hostId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own tours');
        }
        await this.tourRepository.remove(tour);
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tour_entity_1.Tour)),
    __param(1, (0, typeorm_1.InjectRepository)(itinerary_item_entity_1.ItineraryItem)),
    __param(2, (0, typeorm_1.InjectRepository)(tour_media_entity_1.TourMedia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ToursService);
//# sourceMappingURL=tours.service.js.map