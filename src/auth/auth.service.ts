import { Injectable } from "@nestjs/common";
import { User } from "src/user/entites/user.entity";
import { compare } from "bcrypt";
import { UserService } from "src/user/user.service";
import { Unauthorized } from "./errors/auth.unauthorized.error";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  signup(user: Partial<User>): Promise<User> {
    return this.userService.signup(user);
  }

  async login(cred: Partial<User>): Promise<{ token: string }> {
    const normalizedEmail = cred.email.toLowerCase();
    const user = await this.userService.findUserByEmail(normalizedEmail);
    if (!user) {
      throw new Unauthorized("Invalid email or password");
    }

    const validPassword = await compare(cred.password, user.password);
    if (!validPassword) {
      throw new Unauthorized("Invalid email or password");
    }

    const payload = { username: user.username, id: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { token: accessToken };
  }
}
