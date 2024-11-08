import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserResponse } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  async create({ login, password }: CreateUserDto): Promise<UserResponse> {
    const createdAt = new Date().getTime();
    const newUser: UserResponse = {
      id: crypto.randomUUID(),
      login,
      createdAt,
      updatedAt: createdAt,
      version: 1,
    };
    this.users.push({ ...newUser, password });
    return newUser;
  }

  async findAll(): Promise<UserResponse[]> {
    return this.users.map(({ login, createdAt, id, version, updatedAt }) => ({
      id,
      login,
      createdAt,
      updatedAt,
      version,
    }));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      version: user.version,
    };
  }

  async update(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User does not exist!');
    }

    const user = this.users[userIndex];

    if (user.password !== oldPassword) {
      throw new ForbiddenException('Old password is incorrect!');
    }

    const updateUser = {
      ...user,
      password: newPassword,
      updatedAt: new Date().getTime(),
      version: user.version + 1,
    };

    this.users[userIndex] = updateUser;

    return {
      id: updateUser.id,
      login: updateUser.login,
      createdAt: updateUser.createdAt,
      updatedAt: updateUser.updatedAt,
      version: updateUser.version,
    };
  }

  async remove(id: string): Promise<string | null> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException('User does not exist!');
    }

    this.users.splice(userIndex, 1);
    return 'done';
  }
}
