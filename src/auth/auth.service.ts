import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { DatabaseService } from '../database/database.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserResponse } from '../users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  async login(data: CreateUserDto): Promise<AccessTokenDto> {
    const user = await this.databaseService.user.findUnique({
      where: { login: data.login },
    });
    if (!user || user.password !== data.password) {
      throw new ForbiddenException('Incorrect login or password!');
    }

    const { id, login } = user;

    const payload = { userId: id, login };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const refreshToken = await this.jwtService.signAsync(uuid());
    const response = {
      accessToken,
      refreshToken,
    };
    await this.databaseService.user.update({
      where: { id },
      data: { refreshToken },
    });

    return response;
  }

  async signup(data: CreateUserDto): Promise<UserResponse> {
    const userDb = await this.databaseService.user.findUnique({
      where: { login: data.login },
      select: {
        id: true,
        login: true,
        createdAt: true,
        updatedAt: true,
        version: true,
      },
    });

    const user =
      userDb ||
      (await this.databaseService.user.create({
        data: { ...data, version: 1 },
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

  async refresh({ refreshToken }: RefreshTokenDto): Promise<AccessTokenDto> {
    const user = await this.databaseService.user.findUnique({
      where: { refreshToken },
      select: {
        id: true,
        login: true,
        refreshToken: true,
      },
    });

    if (!user) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const payload = { userId: user.id, login: user.login };
    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    const newRefreshToken = await this.jwtService.signAsync(uuid());

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
