import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsString } from "class-validator";

export class SignUpDto {
  @IsString()
  @Transform((param: TransformFnParams) => param.value.toLowerCase())
  username: string;

  @IsString()
  name: string;

  @IsEmail()
  @Transform((param: TransformFnParams) => param.value.toLowerCase())
  email: string;

  @IsString()
  password: string;
}
