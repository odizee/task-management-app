import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '../types/task';
import { deleteTask, updateTask, startLoading, stopLoading } from '../store/taskSlice';
import { Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RootState } from '../store/store';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editStatus, setEditStatus] = useState(task.status);
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.loading.tasks[task.id] ?? false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdate = async () => {
    if (editTitle.trim() && editDescription.trim()) {
      dispatch(startLoading(task.id));
      try {
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 1000));
        await dispatch(
          updateTask({
            id: task.id,
            title: editTitle,
            description: editDescription,
            status: editStatus,
          })
        );
        setIsEditing(false);
      } finally {
        dispatch(stopLoading(task.id));
      }
    }
  };

  const handleDelete = async () => {
    dispatch(startLoading(task.id));
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      await dispatch(deleteTask(task.id));
    } finally {
      dispatch(stopLoading(task.id));
    }
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    dispatch(startLoading(task.id));
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      await dispatch(
        updateTask({
          id: task.id,
          title: task.title,
          description: task.description,
          status: newStatus,
        })
      );
    } finally {
      dispatch(stopLoading(task.id));
    }
  };

  const statusColors = {
    todo: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  if (isEditing) {
    return (
      <div 
        className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg space-y-4 transform transition-all duration-200"
        role="form"
        aria-label="Edit task"
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Task title"
          placeholder="Enter task title"
          disabled={isLoading}
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          rows={3}
          aria-label="Task description"
          placeholder="Enter task description"
          disabled={isLoading}
        />
        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value as Task['status'])}
          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          aria-label="Task status"
          disabled={isLoading}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform transition-all duration-200 ${
        isDragging ? 'opacity-50 scale-105' : ''
      } ${isLoading ? 'opacity-75' : ''}`}
      role="listitem"
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          role="button"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {task.title}
            </h3>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
              className={`ml-2 text-xs font-medium rounded-lg px-2 py-0.5 border-0 ${statusColors[task.status]} focus:ring-2 focus:ring-blue-500`}
              disabled={isLoading}
              aria-label="Change task status"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{task.description}</p>
          <div className="flex justify-end space-x-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg dark:text-yellow-400 dark:hover:bg-yellow-900/50 transition-colors disabled:opacity-50"
              aria-label="Edit task"
              disabled={isLoading}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50 relative"
              aria-label="Delete task"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};