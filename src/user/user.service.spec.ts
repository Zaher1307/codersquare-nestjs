import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "./entites/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import {Conflict} from "./errors/user.conflict.error";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("mockSalt"),
  hash: jest.fn().mockResolvedValue("mockHash"),
}));

describe("UserService", () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it("should signup a new user with unique username and email", async () => {
      const user = {
        username: "testuser",
        email: "test@example.com",
        password: "password",
      };

      jest.spyOn(repo, "findOne").mockResolvedValueOnce(null);
      jest.spyOn(repo, "save").mockResolvedValueOnce({
        ...user,
        password: "mockHash",
      } as User);

      const result = await service.signup(user);

      expect(result).toEqual({
        ...user,
        password: "mockHash",
      });

      expect(repo.findOne).toHaveBeenCalledWith({
        where: [
          { username: user.username.toLowerCase() },
          { email: user.email.toLowerCase() },
        ],
      });

      expect(repo.save).toHaveBeenCalledWith({
        ...user,
        password: "mockHash",
      });
    });

    it("should throw Conflict error if username or email already exists", async () => {
      const user = {
        username: "testuser",
        email: "test@example.com",
        password: "password",
      };
      jest.spyOn(repo, "findOne").mockResolvedValueOnce(user as User);
      jest.spyOn(repo, "save").mockResolvedValueOnce(user as User);

      await expect(service.signup(user)).rejects.toThrow(Conflict);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: [
          { username: user.username.toLowerCase() },
          { email: user.email.toLowerCase() },
        ],
      });
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      const user = { email: "test@example.com" } as User;
      jest.spyOn(repo, "findOne").mockResolvedValueOnce(user);

      const result = await service.findUserByEmail("test@example.com");
      expect(result).toEqual(user);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
    });

    it("should return null if user is not found by email", async () => {
      jest.spyOn(repo, "findOne").mockResolvedValueOnce(null);

      const result = await service.findUserByEmail("notfound@example.com");
      expect(result).toBeNull();
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: "notfound@example.com" },
      });
    });
  });
});
