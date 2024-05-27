import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Catch,
} from "@nestjs/common";
import { UserExists } from "../user/errors/user.user-exists.error";
import { InvalidCredentials } from "./errors/auth.invalid-credentials.error";

@Catch(UserExists, InvalidCredentials)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";

    if (err instanceof UserExists) {
      status = HttpStatus.CONFLICT;
      message = err.message;
    } else if (err instanceof InvalidCredentials) {
      status = HttpStatus.UNAUTHORIZED;
      message = err.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
