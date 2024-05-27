import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class LogInDto {
  @IsEmail()
  @Transform((param: TransformFnParams) => param.value.toLowerCase())
  email: string;

  @IsString()
  password: string;
}
