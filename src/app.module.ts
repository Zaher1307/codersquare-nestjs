import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { User } from "./user/entites/user.entity";
import { PostModule } from "./post/post.module";
import { Post } from "./post/entities/post.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || "dev"}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("POSTGRES_HOST"),
        port: parseInt(config.get("POSTGRES_PORT")),
        username: config.get("POSTGRES_USERNAME"),
        password: config.get("POSTGRES_PASSWORD"),
        database: config.get("POSTGRES_DB"),
        entities: [User, Post],
        ssl: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
