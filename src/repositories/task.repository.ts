import { Task } from '../models';
import { Repository } from './Repository';

export const TaskRepository = new Repository<Task>('tasks', ['id', 'title', 'description', 'status'])