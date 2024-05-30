import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseUUIDPipe,
  UseFilters,
  Patch,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { AuthGuard } from "../auth/auth.jwt.guard";
import { PostExceptionFilter } from "./post.exception.filter";
import { UpdatePostDto } from "./dtos/update-post.dto";

@Controller("posts")
export class PostController {
  constructor(private readonly postService: PostService) {}

  // ------------------------------------------------------------------------//

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return this.postService.create(createPostDto, req.user.sub);
  }

  // ------------------------------------------------------------------------//

  @Get("users/:id")
  findUserPosts(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.findUserPosts(id);
  }

  // ------------------------------------------------------------------------//

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.postService.findOne(id);
  }

  // ------------------------------------------------------------------------//

  @UseGuards(AuthGuard)
  @UseFilters(PostExceptionFilter)
  @Patch()
  update(@Request() req: any, @Body() post: UpdatePostDto) {
    const userId = req.user.sub;
    return this.postService.update(userId, post);
  }

  // ------------------------------------------------------------------------//

  @UseGuards(AuthGuard)
  @UseFilters(PostExceptionFilter)
  @Delete(":id")
  remove(@Request() req: any, @Param("id") id: string) {
    const userId = req.user.sub;
    return this.postService.remove(userId, id);
  }
}
