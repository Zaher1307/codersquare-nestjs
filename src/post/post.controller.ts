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
  ParseUUIDPipe,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { CreatePostDto } from "./dtos/create-post.dto";
import { AuthGuard } from "../auth/auth.jwt.guard";

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

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
  //   return this.postService.update(id, updatePostDto);
  // }

  // ------------------------------------------------------------------------//

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.postService.remove(id);
  // }
}
