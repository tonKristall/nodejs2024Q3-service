import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { UserResponse } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DatabaseService) private readonly databaseService: DatabaseService,
  ) {}

  async create(data: CreateUserDto): Promise<UserResponse> {
    const user = await this.databaseService.user.create({
      data: { ...data, version: 1 },
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });

    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.databaseService.user.findMany({
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });

    return users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    }));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.databaseService.user.findUnique({
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      ...user,
      createdAt: new Date(user.createdAt).getTime(),
      updatedAt: new Date(user.updatedAt).getTime(),
    };
  }

  async update(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.databaseService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is incorrect!');
    }

    const data = {
      ...user,
      password: newPassword,
      updatedAt: new Date(),
      version: user.version + 1,
    };

    const updateUser = await this.databaseService.user.update({
      where: { id },
      data,
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });

    return {
      ...updateUser,
      createdAt: new Date(updateUser.createdAt).getTime(),
      updatedAt: new Date(updateUser.updatedAt).getTime(),
    };
  }

  async remove(id: string): Promise<string | null> {
    const user = await this.databaseService.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    await this.databaseService.user.delete({ where: { id } });

    return 'done';
  }
}
