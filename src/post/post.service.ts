import { Injectable, UseGuards } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { AuthGuard } from "../auth/auth.jwt.guard";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>
  ) {}

  @UseGuards(AuthGuard)
  create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const post = {
      payload: createPostDto.payload,
      userId: userId,
      createdAt: new Date(),
    };

    return this.repo.save(post);
  }

  findUserPosts(userId: string): Promise<Post[]> {
    return this.repo.find({
      where: {
        userId,
      },
    });
  }

  findOne(id: string): Promise<Post> {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  // update(id: string, updatePostDto: UpdatePostDto) {
  //   return `This action updates a #${id} post`;
  // }
  //
  // remove(id: string) {
  //   return `This action removes a #${id} post`;
  // }
}
