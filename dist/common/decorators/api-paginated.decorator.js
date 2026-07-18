"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiPaginatedResponse = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiPaginatedResponse = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOkResponse)({
        schema: {
            properties: {
                data: {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                },
                total: {
                    type: 'number',
                },
                page: {
                    type: 'number',
                },
                limit: {
                    type: 'number',
                },
            },
        },
    }));
};
exports.ApiPaginatedResponse = ApiPaginatedResponse;
//# sourceMappingURL=api-paginated.decorator.js.map