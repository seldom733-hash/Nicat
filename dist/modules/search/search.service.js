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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const tours_service_1 = require("../tours/tours.service");
let SearchService = class SearchService {
    toursService;
    constructor(toursService) {
        this.toursService = toursService;
    }
    async searchTours(query) {
        return this.toursService.search({
            country: query.country,
            city: query.city,
            category: query.category,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            durationDays: query.duration,
            language: query.language,
            startDate: query.startDate,
            endDate: query.endDate,
            page: query.page,
            limit: query.limit,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
        });
    }
    async getPopularDestinations(limit = 10) {
        const tours = await this.toursService.getFeaturedTours(limit);
        return tours.map((tour) => ({
            country: tour.country,
            city: tour.city,
            tourCount: 1,
        }));
    }
    async getCategories() {
        return [
            { category: 'adventure', label: 'Adventure' },
            { category: 'cultural', label: 'Cultural' },
            { category: 'nature', label: 'Nature' },
            { category: 'city', label: 'City' },
            { category: 'beach', label: 'Beach' },
            { category: 'food', label: 'Food & Wine' },
            { category: 'photography', label: 'Photography' },
            { category: 'wellness', label: 'Wellness' },
            { category: 'family', label: 'Family' },
            { category: 'luxury', label: 'Luxury' },
        ];
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tours_service_1.ToursService])
], SearchService);
//# sourceMappingURL=search.service.js.map