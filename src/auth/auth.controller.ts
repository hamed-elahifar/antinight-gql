import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto';
import { Token } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: SignupDto): Promise<String> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto): Promise<{ accessToken: string } | string> {
    return this.authService.login(dto);
  }
}
