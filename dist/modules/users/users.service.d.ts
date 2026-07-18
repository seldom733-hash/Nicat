import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/constants';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    updateRefreshToken(id: string, refreshToken: string | null): Promise<void>;
    updateStripeAccount(id: string, stripeAccountId: string): Promise<void>;
    findAll(page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    findByRole(role: UserRole): Promise<User[]>;
    findByStripeAccountId(stripeAccountId: string): Promise<User[]>;
    softDelete(id: string): Promise<void>;
}
