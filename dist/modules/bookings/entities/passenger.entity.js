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
exports.Passenger = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./booking.entity");
let Passenger = class Passenger {
    id;
    booking;
    bookingId;
    firstName;
    lastName;
    dateOfBirth;
    gender;
    nationality;
    passportNumber;
    passportExpiry;
    passportCountry;
    emergencyContactName;
    emergencyContactPhone;
    dietaryRequirements;
    medicalConditions;
    isLeadPassenger;
    email;
    phone;
};
exports.Passenger = Passenger;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Passenger.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.passengers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'bookingId' }),
    __metadata("design:type", booking_entity_1.Booking)
], Passenger.prototype, "booking", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Passenger.prototype, "bookingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Passenger.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Passenger.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Passenger.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], Passenger.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Passenger.prototype, "nationality", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "passportNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Passenger.prototype, "passportExpiry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "passportCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "emergencyContactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "emergencyContactPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "dietaryRequirements", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "medicalConditions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Passenger.prototype, "isLeadPassenger", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, nullable: true }),
    __metadata("design:type", String)
], Passenger.prototype, "phone", void 0);
exports.Passenger = Passenger = __decorate([
    (0, typeorm_1.Entity)('passengers')
], Passenger);
//# sourceMappingURL=passenger.entity.js.map