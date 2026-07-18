"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DifficultyLevel = exports.TourCategory = exports.TourStatus = void 0;
var TourStatus;
(function (TourStatus) {
    TourStatus["DRAFT"] = "draft";
    TourStatus["ACTIVE"] = "active";
    TourStatus["PAUSED"] = "paused";
    TourStatus["ARCHIVED"] = "archived";
})(TourStatus || (exports.TourStatus = TourStatus = {}));
var TourCategory;
(function (TourCategory) {
    TourCategory["ADVENTURE"] = "adventure";
    TourCategory["CULTURAL"] = "cultural";
    TourCategory["NATURE"] = "nature";
    TourCategory["CITY"] = "city";
    TourCategory["BEACH"] = "beach";
    TourCategory["FOOD"] = "food";
    TourCategory["WINE"] = "wine";
    TourCategory["PHOTOGRAPHY"] = "photography";
    TourCategory["WELLNESS"] = "wellness";
    TourCategory["FAMILY"] = "family";
    TourCategory["LUXURY"] = "luxury";
    TourCategory["BUDGET"] = "budget";
})(TourCategory || (exports.TourCategory = TourCategory = {}));
var DifficultyLevel;
(function (DifficultyLevel) {
    DifficultyLevel["EASY"] = "easy";
    DifficultyLevel["MODERATE"] = "moderate";
    DifficultyLevel["CHALLENGING"] = "challenging";
    DifficultyLevel["DIFFICULT"] = "difficult";
})(DifficultyLevel || (exports.DifficultyLevel = DifficultyLevel = {}));
//# sourceMappingURL=tour.constant.js.map