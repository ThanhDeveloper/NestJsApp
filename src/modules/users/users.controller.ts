import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { TransformInterceptor } from '../../core/interceptors/transform-interceptor.util';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoggedInUserDto } from './dto/logged-in-user.dto';
import { TimeoutInterceptor } from '../../core/interceptors/timeout.interceptor';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { API_VERSION } from '../../core/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@SkipThrottle()
@ApiTags('users')
@Controller(API_VERSION + 'users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@Throttle(1, 3)
  @SkipThrottle(false)
  @Throttle(2, 60)
  @Get()
  @UseInterceptors(TransformInterceptor, TimeoutInterceptor)
  async getAllUser() {
    return await this.usersService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransformInterceptor, TimeoutInterceptor)
  async get(@Request() req): Promise<LoggedInUserDto> {
    return await this.usersService.getUserLoggedIn(req.user.id);
  }
}
