import { User } from '../../users/entities/user.entity';
export declare class AuthResponseDto {
    user: Omit<User, 'password' | 'refreshToken'>;
    accessToken: string;
    refreshToken: string;
}
