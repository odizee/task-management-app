import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskState } from '../types/task';

const initialState: TaskState = {
  tasks: [],
  filter: 'all',
  darkMode: false,
  loading: {
    tasks: {},
    create: false,
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string>) => {
      state.loading.tasks[action.payload] = true;
    },
    stopLoading: (state, action: PayloadAction<string>) => {
      delete state.loading.tasks[action.payload];
    },
    startCreateLoading: (state) => {
      state.loading.create = true;
    },
    stopCreateLoading: (state) => {
      state.loading.create = false;
    },
    addTask: {
      reducer: (state, action: PayloadAction<Task>) => {
        state.tasks.push(action.payload);
        state.loading.create = false;
      },
      prepare: (title: string, description: string, status: Task['status'] = 'todo') => ({
        payload: {
          id: uuidv4(),
          title,
          description,
          status,
          createdAt: Date.now(),
          order: Date.now(),
        },
      }),
    },
    updateTask: (
      state,
      action: PayloadAction<{ id: string; title: string; description: string; status?: Task['status'] }>
    ) => {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.title = action.payload.title;
        task.description = action.payload.description;
        if (action.payload.status) {
          task.status = action.payload.status;
        }
      }
      delete state.loading.tasks[action.payload.id];
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      delete state.loading.tasks[action.payload];
    },
    toggleStatus: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        if (task.status === 'todo') task.status = 'in-progress';
        else if (task.status === 'in-progress') task.status = 'done';
        else task.status = 'todo';
      }
      delete state.loading.tasks[action.payload];
    },
    reorderTasks: (state, action: PayloadAction<string[]>) => {
      const newOrder = action.payload;
      state.tasks = state.tasks.sort((a, b) => {
        const aIndex = newOrder.indexOf(a.id);
        const bIndex = newOrder.indexOf(b.id);
        return aIndex - bIndex;
      });
    },
    setFilter: (
      state,
      action: PayloadAction<'all' | 'todo' | 'in-progress' | 'done'>
    ) => {
      state.filter = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleStatus,
  reorderTasks,
  setFilter,
  toggleDarkMode,
  startLoading,
  stopLoading,
  startCreateLoading,
  stopCreateLoading,
} = taskSlice.actions;
export default taskSlice.reducer;