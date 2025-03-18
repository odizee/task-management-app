# Task Management Application

A modern, accessible task management application built with React, Redux, and TypeScript. Features drag-and-drop functionality, dark mode support, and persistent storage.

## Features

- ✨ Create, edit, and delete tasks
- 🔄 Drag-and-drop task reordering
- 🏷️ Task status management (Todo, In Progress, Done)
- 🌓 Dark mode support
- 💾 Persistent storage using Redux Persist
- ♿ Full keyboard navigation and screen reader support
- 📱 Responsive design
- 🔄 Loading states for all actions

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit
- Redux Persist
- @dnd-kit for drag and drop
- Tailwind CSS
- Lucide React icons
- Vite

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Accessibility Features

- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly status messages
- Focus management
- Clear error messaging
- Loading state indicators
- High contrast mode support (via dark mode)

## Project Structure

```
src/
├── components/         # React components
├── store/             # Redux store and slices
├── types/             # TypeScript type definitions
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Key Components

- `TaskForm`: Create new tasks with validation
- `TaskList`: Display and manage tasks with drag-and-drop
- `TaskItem`: Individual task display and management
- `TaskFilter`: Filter tasks by status

## State Management

Uses Redux Toolkit for state management with the following features:
- Task CRUD operations
- Task reordering
- Status filtering
- Dark mode toggle
- Persistent storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT