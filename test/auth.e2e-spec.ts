import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "../src/user/entites/user.entity";
import { AuthModule } from "../src/auth/auth.module";
import { AppModule } from "../src/app.module";
import { AuthExceptionFilter } from "../src/auth/auth.exception.filter";

describe("User Signup (e2e)", () => {
  let app: INestApplication;
  let datasource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    app.useGlobalFilters(new AuthExceptionFilter());

    await app.init();

    datasource = app.get(DataSource);
  });

  afterEach(async () => {
    await datasource.createQueryBuilder().delete().from(User).execute();
  });

  afterAll(async () => {
    datasource.destroy();
    await app.close();
  });

  it("/signup (POST) should sign up a new user", async () => {
    const response = await request(app.getHttpServer())
      .post("/auth/signup")
      .send({
        name: "test",
        username: "test",
        email: "test@example.com",
        password: "password",
      })
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", "test@example.com");
  });
});
