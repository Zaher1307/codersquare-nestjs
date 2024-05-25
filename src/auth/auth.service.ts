import { Injectable } from "@nestjs/common";
import { User } from "../user/entites/user.entity";
import { compare } from "bcrypt";
import { UserService } from "../user/user.service";
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

    const validPassword = await compare(cred.password, user?.password);
    if (!user || !validPassword) {
      throw new Unauthorized("Invalid email or password");
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return { token: accessToken };
  }
}
