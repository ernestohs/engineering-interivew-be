import { v4 as uuidv4 } from 'uuid'
import { Task, TasksResponse } from "../models"
import { TaskRepository } from "../repositories/task.repository"
import { paginate } from "../server/paginate"

function updateOriginalWithDelta<T extends object>(original: T, delta: Partial<T>): T {
  // Iterate over the keys in the delta object
  for (const key in delta) {
    // Check if the key exists in delta and update the original object
    if (delta.hasOwnProperty(key)) {
      original[key] = delta[key]!;
    }
  }
  return original;
}

function updateModel(result: any, model: Partial<Task>) {
  model.createdAt = result.createdat;
  model.updatedBy = result.createdby;
  model.updatedBy = 'user@task-api';
  model.updatedAt = (new Date()).toUTCString();

  delete result.createdat;
  delete result.createdby;
  delete result.updatedby;
  delete result.updatedat;
  
  return updateOriginalWithDelta(result, model)
}

export async function getTaskList(
  field?: string,
  order?: string,
  filter?: Record<string, any>,
  page?: number,
  perPage?: number,): Promise<TasksResponse> {

  const tasks: Array<Task> = await TaskRepository.findAll(field, order, filter)

  return paginateData(page, perPage, tasks)
}

export async function createNewTasks(model: Partial<Task>): Promise<Task> {

  model.createdBy = model.updatedBy = 'user@task-api'
  model.createdAt = (new Date()).toUTCString()
  model.updatedAt = (new Date()).toUTCString()
  model.id = uuidv4()

  return TaskRepository.create(model as Task)
}

export async function findTaskById(id: string): Promise<Task> {
  return TaskRepository.findById(id)
}

export async function updateTask(id: string, model: Partial<Task>): Promise<Task> {
  let result: any

  result = await TaskRepository.findById(id)

  if (Object.keys(result).length !== 0) {

    const delta = updateModel(result, model);

    result = await TaskRepository.update(id, delta as Task) || {} as Task
  }
  return result
}

export async function deleteTask(id: string): Promise<void> {
  return TaskRepository.delete(id)
}

function paginateData(page: number | undefined, perPage: number | undefined, tasks: Task[]) {
  let result

  page && perPage
    ? (result = paginate(tasks, page, perPage))
    : (result = paginate(tasks, 1, tasks.length))

  return result as TasksResponse
}
