import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    login(loginDto: LoginDto): Promise<import("./dto/auth-response.dto").AuthResponseDto>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    logout(req: any): Promise<{
        message: string;
    }>;
    getProfile(req: any): Promise<any>;
}
