import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
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
    const userDb = await this.databaseService.user.findUnique({
      where: { login: data.login },
    });

    const password = await hash(data.password, Number(process.env.CRYPT_SALT));
    const user =
      userDb ||
      (await this.databaseService.user.create({
        data: { ...data, password, version: 1 },
        select: {
          id: true,
          login: true,
          createdAt: true,
          updatedAt: true,
          version: true,
        },
      }));

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

    if (!(await compare(oldPassword, user.password))) {
      throw new ForbiddenException('Old password is incorrect!');
    }

    const password = await hash(newPassword, Number(process.env.CRYPT_SALT));
    const data = {
      ...user,
      password,
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
