import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  Request,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from '../../core/interceptors/transform-interceptor.util';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { TimeoutInterceptor } from '../../core/interceptors/timeout.interceptor';

@ApiTags('authentication')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginUserDto })
  @UseInterceptors(TransformInterceptor, TimeoutInterceptor)
  @HttpCode(200)
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  @UseInterceptors(TransformInterceptor, TimeoutInterceptor)
  async signUp(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.register(registerUserDto);
  }
}
