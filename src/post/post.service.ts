import { Injectable, UseGuards } from "@nestjs/common";
import { CreatePostDto } from "./dtos/create-post.dto";
import { UpdatePostDto } from "./dtos/update-post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { AuthGuard } from "../auth/auth.jwt.guard";
import { User } from "../user/entites/user.entity";
import { Forbidden } from "./errors/post.forbidden.error";
import { PostNotFound } from "./errors/post.not-found.error";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // ------------------------------------------------------------------------//

  @UseGuards(AuthGuard)
  create(createPostDto: CreatePostDto, userId: string) {
    const post = {
      payload: createPostDto.payload,
      userId: userId,
      createdAt: new Date(),
    };

    return this.postRepository.save(this.postRepository.create(post));
  }

  // ------------------------------------------------------------------------//

  findUserPosts(userId: string) {
    return this.postRepository.find({
      where: {
        userId,
      },
    });
  }

  // ------------------------------------------------------------------------//

  findOne(id: string) {
    return this.postRepository.findOne({
      where: {
        id,
      },
    });
  }

  // ------------------------------------------------------------------------//

  async update(userId: string, updatePostDto: UpdatePostDto) {
    const post = await this.findOne(updatePostDto.id);
    if (!post) {
      throw new PostNotFound();
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.id !== post.userId) {
      throw new Forbidden();
    }

    post.payload = updatePostDto.payload;

    return this.postRepository.save(this.postRepository.create(post));
  }

  // ------------------------------------------------------------------------//

  async remove(userId: string, id: string) {
    const post = await this.findOne(id);
    if (!post) {
      throw new PostNotFound();
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.id !== post.userId) {
      throw new Forbidden();
    }

    this.postRepository.delete({ id });
  }
}
