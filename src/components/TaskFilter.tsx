import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/taskSlice';
import { RootState } from '../store/store';
import { ListTodo, Clock, CheckCircle2, LayoutGrid } from 'lucide-react';

export const TaskFilter: React.FC = () => {
  const dispatch = useDispatch();
  const currentFilter = useSelector((state: RootState) => state.filter);

  const filters = [
    { value: 'all', label: 'All Tasks', icon: LayoutGrid },
    { value: 'todo', label: 'Todo', icon: ListTodo },
    { value: 'in-progress', label: 'In Progress', icon: Clock },
    { value: 'done', label: 'Done', icon: CheckCircle2 },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.value}
            onClick={() => dispatch(setFilter(filter.value))}
            className={`flex items-center px-3 py-1.5 rounded-lg transition-all duration-200 text-sm ${
              currentFilter === filter.value
                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Icon className="w-4 h-4 mr-1.5" />
            {filter.label}
          </button>
        );
      })}
    </div>
  );
};