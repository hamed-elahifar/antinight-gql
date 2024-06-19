import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from './dto';
import { JwtPayload } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { SmsService } from 'src/sms/sms.service';
import { randomInt } from 'crypto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly sms: SmsService,
  ) {}

  async signup(dto: SignupDto): Promise<String> {
    let user;
    user = await this.userModel
      .findOne({
        phone: dto.phone,
      })

    // new user
    if (!user) {
      user = new this.userModel(dto);
      user.save();
      await this.sms.sendVerify(dto.phone, user.twoFA)
      return "Ok"
    }

    user.twoFA = randomInt(10000, 99999)
    await user.save()
    await this.sms.sendVerify(user.phone, user.twoFA)
    return "OK"
  }

  async login(dto: LoginDto): Promise<{ accessToken: string } | string> {
    let user;
    user = await this.userModel
      .findOne({
        phone: dto.phone,
      })

    if (!user) { // new user
      throw new NotFoundException('user not found')
    }

    if (user.twoFA == dto.code) {
      user.twoFA = 0
      await user.save()
      return this.generateToken({ name: user.name, phone: user.phone })
    }
    throw new UnauthorizedException();
  }

  async generateToken(payload: JwtPayload) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '1Y',
    });
    return { accessToken };
  }
}
