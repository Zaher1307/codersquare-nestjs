import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Catch,
} from "@nestjs/common";
import { Conflict } from "src/user/errors/user.conflict.error";
import { Unauthorized } from "./errors/auth.unauthorized.error";

@Catch(Conflict, Unauthorized)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";

    if (err instanceof Conflict) {
      status = HttpStatus.CONFLICT;
      message = err.message;
    } else if (err instanceof Unauthorized) {
      status = HttpStatus.UNAUTHORIZED;
      message = err.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
