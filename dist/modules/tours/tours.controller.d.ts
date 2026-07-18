import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
export declare class ToursController {
    private readonly toursService;
    constructor(toursService: ToursService);
    create(createTourDto: CreateTourDto, req: any): Promise<import("./entities").Tour>;
    search(searchDto: SearchTourDto): Promise<{
        tours: import("./entities").Tour[];
        total: number;
    }>;
    getFeatured(limit?: number): Promise<import("./entities").Tour[]>;
    getMyTours(req: any, page?: number, limit?: number): Promise<{
        tours: import("./entities").Tour[];
        total: number;
    }>;
    findOne(id: string): Promise<import("./entities").Tour>;
    update(id: string, updateTourDto: UpdateTourDto, req: any): Promise<import("./entities").Tour>;
    updateStatus(id: string, status: string, req: any): Promise<import("./entities").Tour>;
    remove(id: string, req: any): Promise<void>;
}
