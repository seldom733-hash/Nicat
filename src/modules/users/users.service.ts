import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRole } from '../../common/constants';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (userData.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 12);
    }

    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async updateRefreshToken(id: string, refreshToken: string | null): Promise<void> {
    await this.userRepository.update(id, { refreshToken: refreshToken as any });
  }

  async updateStripeAccount(id: string, stripeAccountId: string): Promise<void> {
    await this.userRepository.update(id, {
      stripeAccountId,
      isStripeConnected: true,
    });
  }

  async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return { users, total };
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  async findByStripeAccountId(stripeAccountId: string): Promise<User[]> {
    return this.userRepository.find({ where: { stripeAccountId } });
  }

  async softDelete(id: string): Promise<void> {
    await this.userRepository.update(id, { isActive: false });
  }
}
