import { ErrorResponse, ErrorResponseNotFound } from '../models';
import { ResponsePayload } from './ResponsePayload';
import { Response } from 'express';

export function writeJson(
  response: any,
  arg1: any,
  responseCode?: number,
): void {
  let code: number | undefined;
  let payload: any;

  if (arg1 instanceof ResponsePayload) {
    writeJson(response, arg1.payload, arg1.code);
    return;
  }

  if (responseCode !== undefined && Number.isInteger(responseCode)) {
    code = responseCode;
  } else {
    if (Number.isInteger(arg1)) {
      code = arg1;
    }
  }

  if (code !== undefined && arg1) {
    payload = arg1;
  } else if (arg1) {
    payload = arg1;
  }

  if (!code) {
    // if no response code given, we default to 200
    code = 200;
  }

  if (typeof payload === 'object') {
    payload = JSON.stringify(payload, null, 2);
  }

  response.writeHead(code, { 'Content-Type': 'application/json' });
  response.end(payload);
}

export function responseHandler<T>(res: Response) {
  return (model: T) => writeJson(res, model);
}

export function getItemResponseHandler<T>(res: Response) {
  return (entity: T) => {
    if (Object.keys(entity as any).length !== 0) {
      writeJson(res, entity);
      return;
    }

    const response = {
      code: 404,
      success: false,
      message: 'Not Found',
      timestamp: new Date().toUTCString(),
    } as ErrorResponseNotFound;
    throw response; // Next layer will take care of the error
  };
}

export function createResponseHandler<T>(res: Response) {
  return (enity: T) => {
    writeJson(res, enity, 201);
  };
}

export function errorResponseHandler(res: Response) {
  return (reason: ErrorResponse) => {
    writeJson(res, reason, reason.code || 500);
  };
}
