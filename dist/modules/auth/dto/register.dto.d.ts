import { UserRole } from '../../../common/constants';
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    country?: string;
    city?: string;
}
