import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  InternalServerErrorException,
  BadGatewayException,
  HttpStatus,
  NotImplementedException,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';

//@Catch(HttpException)
//export class CHttpExceptionFilter implements ExceptionFilter {
//  catch(exception: HttpException, host: ArgumentsHost) {
//    const ctx = host.switchToHttp();
//    const response = ctx.getResponse<Response>();
//    const request = ctx.getRequest<Request>();
//    const status = exception.getStatus();
//    if (exception instanceof HttpException && exception.getStatus() >= 500) {
//      if (
//        exception instanceof InternalServerErrorException ||
//        exception instanceof NotImplementedException ||
//        exception instanceof BadGatewayException
//      ) {
//        response.status(status).json({
//          statusCode: 400,
//          timestamp: new Date().toISOString(),
//          path: request.url,
//        });
//      }
//    } else throw exception;
//  }
//}

@Catch(
  InternalServerErrorException,
  NotImplementedException,
  BadGatewayException,
  HttpException,
//  Error,
//  TypeError,
)
export class HeaderAlreadySentExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Check if the exception is an instance of the "Cannot set headers after they are sent" error
    // console.log('baseExceptionFilter');
	//if(exception instanceof TypeError){
	//	console.log("TypeError");
	//	return;
	//}
    if (
      exception instanceof Error &&
      (exception.message.includes(
        'Cannot remove headers after they are sent to the client',
      ) ||
        exception.message.includes('Cannot set headers after they are sent'))
    ) {
      // Handle the exception here (e.g., by doing nothing to suppress the error)
      //console.log('Headers ERROR');
      //console.error(exception);
    } else {
      // If it's not the headers error, then just default back to normal exception handling
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const request = ctx.getRequest();
      if (exception instanceof HttpException && exception.getStatus() >= 500) {
        const status =
          exception instanceof HttpException
            ? exception.getStatus() >= 500
              ? HttpStatus.BAD_REQUEST
              : exception.getStatus()
            : HttpStatus.BAD_REQUEST;

        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message:
            exception instanceof HttpException
              ? exception.getStatus() >= 500
                ? 'Bad Request From User'
                : exception.getStatus()
              : 'Bad Request From User',
        });
      } else if (exception instanceof HttpException) {
        //console.log('HttpException sa');
        super.catch(exception, host);
      } else {
        //console.log('Error',exception);
        //super.catch(exception, host);
      }
    }
  }
}
