import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import * as brcypt from 'bcrypt';
import * as validator from 'validator';
import { UserEntity } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string) {
    let user: UserEntity;
    if (validator.isEmail(usernameOrEmail)) {
      user = await this.userService.getUserByEmail(usernameOrEmail);
    } else {
      user = await this.userService.getUserByUsername(usernameOrEmail);
    }
    if (!user) throw new UnauthorizedException('User not found');
    if (await brcypt.compare(password, user.password)) {
      return {
        usernameOrEmail,
        id: user.id,
      };
    }
    throw new UnauthorizedException('Password incorrect');
  }

  login(usernameOrEmail: string, userId: string) {
    return {
      usernameOrEmail,
      accessToken: this.jwtService.sign({ sub: userId }),
    };
  }
}
