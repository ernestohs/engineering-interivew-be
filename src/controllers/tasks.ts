import { NextFunction, Request, Response } from 'express';
import {
  createNewTasks,
  deleteTask,
  findTaskById,
  getTaskList,
  updateTask,
} from '../service/TaskService';
import {
  responseHandler,
  errorResponseHandler,
  getItemResponseHandler,
  createResponseHandler,
} from '../server/respondWithCode';
import { Task, TaskUpdate, TasksResponse } from '../models';

export function getTasks(
  req: Request,
  res: Response,
  next: NextFunction,
  field: string | undefined,
  order: string | undefined,
  filter: Record<string, any> | undefined,
  page: number = 1,
  perPage: number = 10,
): void {
  getTaskList(field, order, filter, page, perPage)
    .then(responseHandler<TasksResponse>(res))
    .catch(errorResponseHandler(res));
}

export function createTasks(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  createNewTasks(req.body)
    .then(createResponseHandler<Task>(res))
    .catch(errorResponseHandler(res));
}

export function getTasksById(
  req: Request,
  res: Response,
  next: NextFunction,
  taskId: string,
): void {
  findTaskById(taskId)
    .then(getItemResponseHandler<Task>(res))
    .catch(errorResponseHandler(res));
}

export function updateTasks(
  req: Request,
  res: Response,
  next: NextFunction,
  model: TaskUpdate,
  taskId: string,
): void {
  updateTask(taskId, req.body)
    .then(getItemResponseHandler<Task>(res))
    .catch(errorResponseHandler(res));
}

export function deleteTasks(
  req: Request,
  res: Response,
  next: NextFunction,
  taskId: string,
): void {
  deleteTask(taskId)
    .then(responseHandler<void>(res))
    .catch(errorResponseHandler(res));
}
