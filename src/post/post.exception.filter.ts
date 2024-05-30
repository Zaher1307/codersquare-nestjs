import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { PostNotFound } from "./errors/post.not-found.error";
import { Forbidden } from "./errors/post.forbidden.error";

@Catch(PostNotFound, Forbidden)
export class PostExceptionFilter implements ExceptionFilter {
  catch(err: any, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal Server Error";

    if (err instanceof PostNotFound) {
      status = HttpStatus.NOT_FOUND;
      message = err.message;
    } else if (err instanceof Forbidden) {
      status = HttpStatus.FORBIDDEN;
      message = err.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
