import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserResponse } from '../users/interfaces/user.interface';
import { AuthService } from './auth.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './public.decorator';
import { AccessTokenDto } from './dto/access-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.authService.signup(createUserDto);
  }

  @Public()
  @Post('login')
  async login(@Body() createUserDto: CreateUserDto): Promise<AccessTokenDto> {
    return await this.authService.login(createUserDto);
  }

  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshTokenDto> {
    return await this.authService.refresh(refreshTokenDto);
  }
}
