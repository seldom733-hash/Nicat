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
exports.CreateConnectAccountDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateConnectAccountDto {
    country;
    returnUrl;
    refreshUrl;
}
exports.CreateConnectAccountDto = CreateConnectAccountDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Код страны (по умолчанию US)',
        example: 'US',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['US', 'GB', 'CA', 'DE', 'FR', 'ES', 'IT', 'AU', 'JP', 'BR']),
    __metadata("design:type", String)
], CreateConnectAccountDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL для возврата после онбординга' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateConnectAccountDto.prototype, "returnUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL для обновления при ошибках' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateConnectAccountDto.prototype, "refreshUrl", void 0);
//# sourceMappingURL=create-connect-account.dto.js.map