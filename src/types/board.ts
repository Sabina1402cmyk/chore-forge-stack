export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export type TaskStatus = 'todo' | 'in-progress' | 'done';

export const TASK_STATUSES: Record<TaskStatus, { label: string; color: string }> = {
  'todo': { label: 'К выполнению', color: 'bg-yellow-100 text-yellow-800' },
  'in-progress': { label: 'В работе', color: 'bg-blue-100 text-blue-800' },
  'done': { label: 'Выполнено', color: 'bg-green-100 text-green-800' }
};