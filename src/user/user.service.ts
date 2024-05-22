import { Injectable } from "@nestjs/common";
import { User } from "./entites/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { genSalt, hash } from "bcrypt";
import { Conflict } from "./errors/user.conflict.error";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>
  ) {}

  async signup(user: Partial<User>): Promise<User> {
    const normalizedEmail = user.email.toLowerCase();
    const existingUser = await this.repo.findOne({
      where: [
        { username: user.username.toLowerCase() },
        { email: normalizedEmail },
      ],
    });

    if (existingUser) {
      throw new Conflict("Username or email already exists");
    }

    const salt = await generateSalt();
    const passwordHash = await hashPassword(user.password, salt);
    const newUser = {
      ...user,
      password: passwordHash,
    };

    return this.repo.save(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.repo.findOne({
      where: {
        email: email,
      },
    });
  }
}

async function generateSalt() {
  const saltRounds = 10;
  return await genSalt(saltRounds);
}

async function hashPassword(password: string, salt: string) {
  return await hash(password, salt);
}
