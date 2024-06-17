import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthDto } from './dto';
import { JwtPayload, Tokens } from './types';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { HashingSerivce } from './hashing.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
    private config: ConfigService,
    private readonly hashingService: HashingSerivce,
  ) {}

  
  async signup(dto: AuthDto): Promise<Tokens> {
    let token;
    try {
      const user = new this.userModel(dto);
      await user.save();
      token = await this.generateToken({
        id: user.id,
        username: user.username,
      });
    } catch (error) {
      throw new ConflictException();
    }

    return token;
  }

  async login(dto: AuthDto): Promise<Tokens> {
    const user = await this.userModel
      .findOne({
        username: dto.username,
      })
      .select('username password email  roles');

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const isEqual = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Unauthorized');
    }

    const token = await this.generateToken({
      id: user.id,
      username: user.username,
      // : user.,
      roles: user.roles,
    });

    return token;
  }

  async generateToken(payload: JwtPayload): Promise<Tokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET'),
      expiresIn: '30d',
    });

    return { accessToken };
  }
}
