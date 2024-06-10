import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseFilters,
} from "@nestjs/common";
import { SignUpDto } from "./dtos/auth.signup.dto";
import { AuthExceptionFilter } from "./auth.exception.filter";
import { AuthService } from "./auth.service";
import { LogInDto } from "./dtos/auth.login.dto";

@UseFilters(AuthExceptionFilter)
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ------------------------------------------------------------------------//

  @Post("signup")
  signup(@Body() user: SignUpDto) {
    return this.authService.signup(user);
  }

  // ------------------------------------------------------------------------//

  @HttpCode(200)
  @Post("login")
  login(@Body() user: LogInDto) {
    return this.authService.login(user);
  }

  @Get("healthz")
  health() {
    return "hello lasting dynamics";
  }
}
