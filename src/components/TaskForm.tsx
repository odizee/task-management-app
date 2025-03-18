import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, startCreateLoading, stopCreateLoading } from '../store/taskSlice';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { Task } from '../types/task';
import { RootState } from '../store/store';

interface TaskFormProps {
  onComplete?: () => void;
}

type ValidationErrors = {
  title?: string;
  description?: string;
};

export const TaskForm: React.FC<TaskFormProps> = ({ onComplete }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Task['status']>('todo');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.create);

  const validateField = (name: string, value: string) => {
    const newErrors: ValidationErrors = { ...errors };
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Title is required';
        } else if (value.trim().length < 3) {
          newErrors.title = 'Title must be at least 3 characters';
        } else if (value.trim().length > 50) {
          newErrors.title = 'Title must be less than 50 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.trim().length < 10) {
          newErrors.description = 'Description must be at least 10 characters';
        } else if (value.trim().length > 500) {
          newErrors.description = 'Description must be less than 500 characters';
        } else {
          delete newErrors.description;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, field === 'title' ? title : description);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const titleValid = validateField('title', title);
    const descriptionValid = validateField('description', description);
    setTouched({ title: true, description: true });

    if (titleValid && descriptionValid) {
      dispatch(startCreateLoading());
      try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        await dispatch(addTask(title, description, status));
        setTitle('');
        setDescription('');
        setStatus('todo');
        setErrors({});
        setTouched({});
        onComplete?.();
      } finally {
        dispatch(stopCreateLoading());
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Add new task">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h2>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (touched.title) {
              validateField('title', e.target.value);
            }
          }}
          onBlur={() => handleBlur('title')}
          placeholder="Enter task title"
          className={`w-full px-3 py-2 text-sm rounded-lg border ${
            errors.title && touched.title
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors`}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
          disabled={isLoading}
        />
        {errors.title && touched.title && (
          <div id="title-error" className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center" role="alert">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.title}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (touched.description) {
              validateField('description', e.target.value);
            }
          }}
          onBlur={() => handleBlur('description')}
          placeholder="Enter task description"
          className={`w-full px-3 py-2 text-sm rounded-lg border ${
            errors.description && touched.description
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          } dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors`}
          rows={3}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
          disabled={isLoading}
        />
        {errors.description && touched.description && (
          <div id="description-error" className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center" role="alert">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.description}
          </div>
        )}
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as Task['status'])}
          className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-400 transition-colors"
          disabled={isLoading}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        Add Task
      </button>
    </form>
  );
};