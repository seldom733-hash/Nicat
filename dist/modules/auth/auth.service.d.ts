import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly configService;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponseDto>;
    login(email: string, password: string): Promise<AuthResponseDto>;
    validateUser(email: string, password: string): Promise<any>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(userId: string): Promise<void>;
    private generateTokens;
    private generateAccessToken;
    private generateRefreshToken;
    private sanitizeUser;
}
