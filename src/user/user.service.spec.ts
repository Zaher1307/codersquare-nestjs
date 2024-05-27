import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { Repository } from "typeorm";
import { User } from "./entites/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserExists } from "./errors/user.user-exists.error";
import { SignUpDto } from "src/auth/dtos/auth.signup.dto";
import { ConfigService } from "@nestjs/config";

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("mockSalt"),
  hash: jest.fn().mockResolvedValue("mockHash"),
}));

const inputUser = {
  id: "uuid",
  name: "test user",
  username: "test",
  email: "test@user.com",
  password: "mockHash",
};

const outputUser = {
  id: "uuid",
  username: "test",
  email: "test@user.com",
};

const repoMock = {
  create: jest
    .fn()
    .mockImplementation((signUpDto: SignUpDto) =>
      Promise.resolve(outputUser as User)
    ),
  save: jest
    .fn()
    .mockImplementation((signUpDto: SignUpDto) =>
      Promise.resolve(outputUser as User)
    ),
  findOne: jest.fn(),
};

const configMock = {
  get: jest.fn().mockImplementation((env: string) => 10),
};

describe("UserService", () => {
  let service: UserService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repoMock,
        },
        {
          provide: ConfigService,
          useValue: configMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("signup", () => {
    it("should signup a new user with unique username and email", async () => {
      repoMock.findOne.mockImplementation((id: string) =>
        Promise.resolve(null)
      );
      const result = await service.create(inputUser);

      expect(result).toEqual(outputUser);

      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it("should throw Conflict error if username or email already exists", async () => {
      repoMock.findOne.mockImplementation((id: string) =>
        Promise.resolve(outputUser as User)
      );

      await expect(service.create(inputUser)).rejects.toThrow(UserExists);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });

  describe("findUserByEmail", () => {
    it("should find a user by email", async () => {
      repoMock.findOne.mockImplementation((id: string) =>
        Promise.resolve(outputUser as User)
      );

      const result = await service.findUserByEmail("test@user.com");
      expect(result).toEqual(outputUser);
      expect(repo.findOne).toHaveBeenCalled();
    });

    it("should return null if user is not found by email", async () => {
      repoMock.findOne.mockImplementation((id: string) =>
        Promise.resolve(null)
      );

      const result = await service.findUserByEmail("notfound@example.com");
      expect(result).toBeNull();
      expect(repo.findOne).toHaveBeenCalled();
    });
  });
});
