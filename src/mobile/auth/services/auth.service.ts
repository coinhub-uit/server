import { Injectable } from '@nestjs/common';
import { UserService } from 'src/mobile/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import UserInterface from 'src/mobile/auth/utils/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      const { password, ...result } = user; // eslint-disable-line @typescript-eslint/no-unused-vars
      return result;
    }
    return null;
  }

  login(user: UserInterface) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
