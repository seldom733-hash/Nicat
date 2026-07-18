import { CreateTourDto } from './create-tour.dto';
import { TourStatus } from '../../../common/constants';
declare const UpdateTourDto_base: import("@nestjs/common").Type<Partial<CreateTourDto>>;
export declare class UpdateTourDto extends UpdateTourDto_base {
    status?: TourStatus;
    averageRating?: number;
    reviewCount?: number;
}
export {};
