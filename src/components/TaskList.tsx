import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TaskItem } from './TaskItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useDispatch } from 'react-redux';
import { reorderTasks } from '../store/taskSlice';

export const TaskList: React.FC = () => {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = filteredTasks.findIndex((task) => task.id === active.id);
      const newIndex = filteredTasks.findIndex((task) => task.id === over.id);
      
      const newOrder = arrayMove(
        filteredTasks.map((task) => task.id),
        oldIndex,
        newIndex
      );
      
      dispatch(reorderTasks(newOrder));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SortableContext
          items={filteredTasks.map((t) => t.id)}
          strategy={rectSortingStrategy}
        >
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </SortableContext>
        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-sm text-gray-500 dark:text-gray-400">No tasks found</p>
          </div>
        )}
      </div>
    </DndContext>
  );
};