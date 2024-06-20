import { NextFunction, Request, Response } from "express";

export function getTasks(req: Request, res: Response, next: NextFunction,
  field: string | undefined,
  order: string | undefined,
  filter: Record<string, any> | undefined,
  page: number = 1,
  perPage: number = 10): void {}

export function createTasks(req: Request, res: Response, next: NextFunction): void {}

export function getTasksById(req: Request, res: Response, next: NextFunction, taskId: string): void {}

export function updateTasks(req: Request, res: Response, next: NextFunction, taskId: string): void {}

export function deleteTasks(req: Request, res: Response, next: NextFunction, taskId: string): void {}