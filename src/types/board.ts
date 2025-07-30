export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  estimatedHours?: number;
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

export const TASK_PRIORITIES: Record<TaskPriority, { label: string; color: string; weight: number }> = {
  'low': { label: 'Низкий', color: 'bg-gray-100 text-gray-800', weight: 1 },
  'medium': { label: 'Средний', color: 'bg-blue-100 text-blue-800', weight: 2 },
  'high': { label: 'Высокий', color: 'bg-orange-100 text-orange-800', weight: 3 },
  'critical': { label: 'Критический', color: 'bg-red-100 text-red-800', weight: 4 }
};