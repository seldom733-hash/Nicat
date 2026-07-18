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
exports.SearchController = void 0;
const common_1 = require("@nestjs/common");
const search_service_1 = require("./search.service");
let SearchController = class SearchController {
    searchService;
    constructor(searchService) {
        this.searchService = searchService;
    }
    async search(q, country, city, category, minPrice, maxPrice, duration, language, difficulty, startDate, endDate, page, limit, sortBy, sortOrder) {
        return this.searchService.searchTours({
            q,
            country,
            city,
            category,
            minPrice,
            maxPrice,
            duration,
            language,
            difficulty,
            startDate,
            endDate,
            page,
            limit,
            sortBy,
            sortOrder,
        });
    }
    async getPopularDestinations(limit) {
        return this.searchService.getPopularDestinations(limit);
    }
    async getCategories() {
        return this.searchService.getCategories();
    }
};
exports.SearchController = SearchController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('country')),
    __param(2, (0, common_1.Query)('city')),
    __param(3, (0, common_1.Query)('category')),
    __param(4, (0, common_1.Query)('minPrice')),
    __param(5, (0, common_1.Query)('maxPrice')),
    __param(6, (0, common_1.Query)('duration')),
    __param(7, (0, common_1.Query)('language')),
    __param(8, (0, common_1.Query)('difficulty')),
    __param(9, (0, common_1.Query)('startDate')),
    __param(10, (0, common_1.Query)('endDate')),
    __param(11, (0, common_1.Query)('page')),
    __param(12, (0, common_1.Query)('limit')),
    __param(13, (0, common_1.Query)('sortBy')),
    __param(14, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number, Number, String, String, String, String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('destinations'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getPopularDestinations", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SearchController.prototype, "getCategories", null);
exports.SearchController = SearchController = __decorate([
    (0, common_1.Controller)('search'),
    __metadata("design:paramtypes", [search_service_1.SearchService])
], SearchController);
//# sourceMappingURL=search.controller.js.map