import { Injectable } from "@nestjs/common";
import { User } from "./entites/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";
import { UserExists } from "./errors/user.user-exists.error";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  // ------------------------------------------------------------------------//

  async create(user: Partial<User>) {
    const existingUser = await this.findUserByEmail(user.email);

    if (existingUser) {
      throw new UserExists("Username or email already exists");
    }

    const salt = await this.generateSalt();
    user.password = await this.hashPassword(user.password, salt);

    return await this.userRepository.save(this.userRepository.create(user));
  }

  // ------------------------------------------------------------------------//

  async findUserByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  // ------------------------------------------------------------------------//

  private async generateSalt() {
    return await genSalt(parseInt(this.configService.get("SALT_ROUNDS")));
  }

  // ------------------------------------------------------------------------//

  private async hashPassword(password: string, salt: string) {
    return await hash(password, salt);
  }
}
