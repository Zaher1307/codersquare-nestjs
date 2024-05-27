import { Injectable } from "@nestjs/common";
import { User } from "../user/entites/user.entity";
import { compare } from "bcrypt";
import { UserService } from "../user/user.service";
import { InvalidCredentials } from "./errors/auth.invalid-credentials.error";
import { SignUpDto } from "./dtos/auth.signup.dto";
import { JwtStrategy } from "./auth.jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtStrategy: JwtStrategy
  ) {}

  // ------------------------------------------------------------------------//

  signup(user: SignUpDto) {
    return this.userService.create(user);
  }

  // ------------------------------------------------------------------------//

  async login(user: Partial<User>) {
    const u = await this.userService.findUserByEmail(user.email);
    if (!u) {
      throw new InvalidCredentials("Invalid email or password");
    }

    const validPassword = await compare(user.password, u.password);
    if (!validPassword) {
      throw new InvalidCredentials("Invalid email or password");
    }

    const payload = { email: u.email, sub: u.id };
    const accessToken = await this.jwtStrategy.sign(payload);

    return { token: accessToken };
  }
}
