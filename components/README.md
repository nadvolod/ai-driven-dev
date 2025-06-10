# Task Management App - Component Architecture

This document outlines the component structure for a TypeScript + Next.js task management application with four main components following single responsibility principles.

## Component Overview

### 1. TaskCard Component (`TaskCard.tsx`)

**Purpose**: Displays individual task items with interactive controls.

**Props Interface**:
```typescript
interface TaskCardProps {
  task: Task;                               // The task object to display
  onToggleComplete: (taskId: string) => void; // Callback for completion toggle
  onEdit: (task: Task) => void;             // Callback for task editing
  onDelete: (taskId: string) => void;       // Callback for task deletion
  className?: string;                       // Optional custom styling
}
```

**Key Functionality**:
- ✅ Task title and description display
- ✅ Completion status toggle with checkbox
- ✅ Priority indicator with color coding
- ✅ Edit and delete action buttons
- ✅ Created/updated timestamp display
- ✅ Category badge display
- ✅ Strike-through styling for completed tasks

**Styling Approach**:
- Tailwind CSS with responsive design
- Priority-based color coding (red=high, yellow=medium, green=low)
- Hover effects and smooth transitions
- Accessibility support with proper ARIA labels

**State Management**: Stateless component - all state managed by parent

---

### 2. TaskList Component (`TaskList.tsx`)

**Purpose**: Renders and manages a collection of tasks with filtering and sorting.

**Props Interface**:
```typescript
interface TaskListProps {
  tasks: Task[];                           // Array of tasks to display
  filter: TaskFilter;                      // Current filter settings
  onToggleComplete: (taskId: string) => void; // Callback for completion toggle
  onEdit: (task: Task) => void;           // Callback for task editing
  onDelete: (taskId: string) => void;     // Callback for task deletion
  loading?: boolean;                      // Loading state indicator
  className?: string;                     // Optional custom styling
}
```

**Key Functionality**:
- ✅ Task filtering by status, priority, and category
- ✅ Automatic sorting (incomplete first, then by priority, then by date)
- ✅ Loading state with skeleton UI
- ✅ Empty state handling with helpful messaging
- ✅ Task count summary display
- ✅ Responsive layout

**Styling Approach**:
- Tailwind CSS with responsive grid
- Loading skeleton animations
- Empty state illustrations
- Summary statistics styling

**State Management**: Stateless component - receives filtered tasks from parent

---

### 3. AddTaskForm Component (`AddTaskForm.tsx`)

**Purpose**: Form component for creating new tasks with validation.

**Props Interface**:
```typescript
interface AddTaskFormProps {
  onCreateTask: (task: CreateTaskInput) => void; // Callback for task creation
  loading?: boolean;                             // Loading state for submission
  className?: string;                            // Optional custom styling
}
```

**Key Functionality**:
- ✅ Collapsible form interface
- ✅ Title input with character counter (max 100)
- ✅ Description textarea with character counter (max 500)
- ✅ Priority selection dropdown
- ✅ Category input field
- ✅ Form validation with error messages
- ✅ Loading state during submission
- ✅ Form reset after successful submission

**Styling Approach**:
- Tailwind CSS form styling
- Validation error states
- Loading indicators
- Responsive layout for mobile/desktop

**State Management**: Local form state with validation

---

### 4. TaskFilter Component (`TaskFilter.tsx`)

**Purpose**: Provides filtering controls for the task list.

**Props Interface**:
```typescript
interface TaskFilterProps {
  filter: TaskFilter;                      // Current filter settings
  onFilterChange: (filter: TaskFilter) => void; // Callback for filter changes
  availableCategories: string[];           // Dynamic category list
  className?: string;                      // Optional custom styling
}
```

**Key Functionality**:
- ✅ Status filtering (All, Pending, Completed)
- ✅ Priority filtering with color indicators
- ✅ Dynamic category filtering
- ✅ Clear all filters button
- ✅ Active filter summary display
- ✅ Responsive button layout

**Styling Approach**:
- Tailwind CSS with button groups
- Active/inactive state styling
- Priority color indicators
- Responsive flex layout

**State Management**: Stateless component - filter state managed by parent

---

## Type Definitions

### Core Task Interface
```typescript
interface Task {
  id: string;           // UUID format
  title: string;        // Required, max 100 characters
  description?: string; // Optional, max 500 characters
  completed: boolean;   // Default false
  priority: TaskPriority; // Enum: low, medium, high
  createdAt: Date;      // Auto-generated
  updatedAt: Date;      // Auto-updated
  category?: string;    // Optional classification
}
```

### Supporting Types
```typescript
enum TaskPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

enum TaskStatus {
  ALL = "all",
  COMPLETED = "completed",
  PENDING = "pending"
}

interface TaskFilter {
  status: TaskStatus;
  priority?: TaskPriority;
  category?: string;
}

type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
  completed?: boolean;
};
```

---

## Usage Example

```typescript
'use client';

import React, { useState, useCallback } from 'react';
import { Task, TaskFilter, TaskStatus, CreateTaskInput } from '../types/task';
import { TaskList } from '../components/TaskList';
import { AddTaskForm } from '../components/AddTaskForm';
import { TaskFilter as TaskFilterComponent } from '../components/TaskFilter';

export default function TaskManagementPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>({
    status: TaskStatus.ALL,
    priority: undefined,
    category: undefined
  });
  const [loading, setLoading] = useState(false);

  // Create new task
  const handleCreateTask = useCallback(async (taskInput: CreateTaskInput) => {
    setLoading(true);
    try {
      const newTask: Task = {
        ...taskInput,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTasks(prev => [newTask, ...prev]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle task completion
  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  }, []);

  // Edit task
  const handleEditTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id 
        ? { ...updatedTask, updatedAt: new Date() }
        : task
    ));
  }, []);

  // Delete task
  const handleDeleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  // Get available categories
  const availableCategories = Array.from(
    new Set(tasks.filter(task => task.category).map(task => task.category!))
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <p className="text-gray-600 mt-2">Organize and track your tasks efficiently</p>
      </header>

      <AddTaskForm 
        onCreateTask={handleCreateTask}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <TaskFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            availableCategories={availableCategories}
          />
        </div>
        
        <div className="lg:col-span-3">
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
```

---

## Installation Requirements

```bash
# Required dependencies
npm install react react-dom next typescript
npm install -D @types/react @types/react-dom @types/node
npm install -D tailwindcss postcss autoprefixer
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

---

## Key Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Components are composed together
3. **TypeScript First**: Strong typing throughout with proper interfaces
4. **Accessibility**: ARIA labels, keyboard navigation, screen reader support
5. **Responsive Design**: Mobile-first approach with Tailwind CSS
6. **Performance**: Optimized with React.memo, useMemo, and useCallback where appropriate
7. **User Experience**: Loading states, error handling, smooth animations

This architecture provides a solid foundation for a scalable task management application with clear separation of concerns and excellent developer experience. 