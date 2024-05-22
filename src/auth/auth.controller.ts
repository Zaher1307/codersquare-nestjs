import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SignUpDto } from "src/auth/dtos/auth.signup.dto";
import { UserInterceptor } from "./auth.signup.interceptor";
import { AuthExceptionFilter } from "./auth.exception.filter";
import { AuthService } from "./auth.service";
import { LogInDto } from "./dtos/auth.login.dto";
import { UserDto } from "./dtos/auth.user.dto";

@UseFilters(AuthExceptionFilter)
@UsePipes(new ValidationPipe())
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(UserInterceptor)
  @Post("signup")
  signup(@Body() user: SignUpDto): Promise<UserDto> {
    return this.authService.signup(user);
  }

  @HttpCode(200)
  @Post("login")
  login(@Body() user: LogInDto): Promise<{ token: string }> {
    return this.authService.login(user);
  }
}
