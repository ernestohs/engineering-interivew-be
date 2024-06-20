import {v4 as uuidv4} from 'uuid'
import { Task, TasksResponse } from "../models"
import { TaskRepository } from "../repositories/task.repository"
import { paginate } from "../server/paginate"

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

export async function findTaskById(id: string): Promise<Task>  {
  return TaskRepository.findById(id)
}

export async function updateTask(id:string, model: Partial<Task>): Promise<Task>  {
  let result: Task

  result = await TaskRepository.findById(id)
  
  if (Object.keys(result).length !== 0) {
    model.updatedBy = 'user@task-api'
    model.updatedAt = (new Date()).toUTCString()
    result = await TaskRepository.update(id, model as Task) || {} as Task
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
