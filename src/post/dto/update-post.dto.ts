import { IsString, IsUUID } from "class-validator";

export class UpdatePostDto {
  @IsUUID()
  id: string;

  @IsString()
  payload: string;
}
