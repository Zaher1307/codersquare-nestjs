import { IsString } from "class-validator";

export class CreatePostDto {
  @IsString()
  payload: string;
}
