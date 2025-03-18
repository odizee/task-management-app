export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdAt: number;
  order: number;
}

export interface TaskState {
  tasks: Task[];
  filter: 'all' | 'todo' | 'in-progress' | 'done';
  darkMode: boolean;
  loading: {
    tasks: Record<string, boolean>;
    create: boolean;
  };
}