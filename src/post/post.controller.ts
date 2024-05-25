import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { AuthGuard } from "../auth/auth.jwt.guard";
import { IdParam } from "./dto/user-id.param.dto";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.postService.create(createPostDto, req.user.id);
  }

  @Get("users/:id")
  @UsePipes(new ValidationPipe({ transform: true }))
  findUserPosts(@Param() params: IdParam) {
    const userId = params.id;
    return this.postService.findUserPosts(userId);
  }

  @Get(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param() params: IdParam) {
    const id = params.id;
    return this.postService.findOne(id);
  }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(id, updatePostDto);
  // }
  //
  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.postService.remove(id);
  // }
}
