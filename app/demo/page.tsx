'use client';

import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskFilter } from '@/components/TaskFilter';
import { TaskList } from '@/components/TaskList';
import { generateId, loadTasksFromStorage, saveTasksToStorage } from '@/lib/utils';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useEffect, useState } from 'react';

/**
 * Demo Page Component
 * 
 * Showcases all enhanced features of the task management app:
 * - Task creation with due dates
 * - Task completion with visual feedback
 * - Priority-based sorting
 * - Local storage persistence
 * - Smooth animations
 * - Advanced filtering
 * - Overdue task indicators
 */
export default function DemoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentFilter, setCurrentFilter] = useState({
    status: TaskStatus.ALL,
    priority: undefined as TaskPriority | undefined,
    category: undefined as string | undefined,
    search: undefined as string | undefined
  });
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  // Load tasks from localStorage on mount and create demo data if empty
  useEffect(() => {
    const storedTasks = loadTasksFromStorage();
    if (storedTasks.length > 0) {
      setTasks(storedTasks);
    } else {
      // Create enhanced demo tasks with due dates and varied states
      const demoTasks: Task[] = [
        {
          id: generateId(),
          title: 'Complete project milestone',
          description: 'Finish the core functionality and prepare for the next sprint review.',
          completed: false,
          priority: TaskPriority.HIGH,
          createdAt: new Date('2025-01-08T10:00:00Z'),
          updatedAt: new Date('2025-01-08T10:00:00Z'),
          category: 'Development',
          dueDate: new Date('2025-01-15T23:59:59Z') // Due in future
        },
        {
          id: generateId(),
          title: 'Update design system documentation',
          description: 'Add new component examples and usage guidelines for the team.',
          completed: true,
          priority: TaskPriority.MEDIUM,
          createdAt: new Date('2025-01-05T09:00:00Z'),
          updatedAt: new Date('2025-01-09T15:30:00Z'),
          category: 'Design',
          dueDate: new Date('2025-01-10T17:00:00Z') // Was due recently
        },
        {
          id: generateId(),
          title: 'Fix critical security vulnerability',
          description: 'Address the authentication bypass issue found in the security audit.',
          completed: false,
          priority: TaskPriority.HIGH,
          createdAt: new Date('2025-01-10T08:00:00Z'),
          updatedAt: new Date('2025-01-10T08:00:00Z'),
          category: 'Security',
          dueDate: new Date('2025-01-12T12:00:00Z') // Due soon
        },
        {
          id: generateId(),
          title: 'Optimize database queries',
          description: 'Improve performance of the user dashboard by optimizing slow SQL queries.',
          completed: false,
          priority: TaskPriority.MEDIUM,
          createdAt: new Date('2025-01-07T14:00:00Z'),
          updatedAt: new Date('2025-01-07T14:00:00Z'),
          category: 'Performance',
          dueDate: new Date('2025-01-08T23:59:59Z') // Overdue!
        },
        {
          id: generateId(),
          title: 'Team retrospective meeting',
          completed: true,
          priority: TaskPriority.LOW,
          createdAt: new Date('2025-01-09T11:00:00Z'),
          updatedAt: new Date('2025-01-09T16:00:00Z'),
          category: 'Meetings'
        },
        {
          id: generateId(),
          title: 'Code review for authentication module',
          description: 'Review the new OAuth implementation and provide feedback.',
          completed: false,
          priority: TaskPriority.MEDIUM,
          createdAt: new Date('2025-01-10T13:00:00Z'),
          updatedAt: new Date('2025-01-10T13:00:00Z'),
          category: 'Development',
          dueDate: new Date('2025-01-20T17:00:00Z')
        },
        {
          id: generateId(),
          title: 'Prepare quarterly presentation',
          description: 'Create slides for the Q1 business review meeting with stakeholders.',
          completed: false,
          priority: TaskPriority.HIGH,
          createdAt: new Date('2025-01-06T10:00:00Z'),
          updatedAt: new Date('2025-01-06T10:00:00Z'),
          category: 'Business',
          dueDate: new Date('2025-01-14T09:00:00Z')
        },
        {
          id: generateId(),
          title: 'Write API documentation',
          description: 'Document the new REST endpoints for the mobile team.',
          completed: false,
          priority: TaskPriority.LOW,
          createdAt: new Date('2025-01-09T16:00:00Z'),
          updatedAt: new Date('2025-01-09T16:00:00Z'),
          category: 'Documentation',
          dueDate: new Date('2025-01-25T17:00:00Z')
        }
      ];
      
      setTasks(demoTasks);
      saveTasksToStorage(demoTasks);
    }
  }, []);

  // Update available categories when tasks change
  useEffect(() => {
    const categories = Array.from(new Set(
      tasks
        .map(task => task.category)
        .filter((category): category is string => Boolean(category))
    )).sort();
    setAvailableCategories(categories);
  }, [tasks]);

  /**
   * Handle task creation
   */
  const handleTaskCreated = (newTask: Task) => {
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  /**
   * Handle task completion toggle
   */
  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    );
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  /**
   * Handle task deletion
   */
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
  };

  /**
   * Sample tasks for feature showcase
   */
  const getSampleTasks = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return [
      {
        id: 'sample-completed',
        title: 'Completed Task Example',
        description: 'This task shows the completed state with strikethrough text and fade effect.',
        completed: true,
        priority: TaskPriority.MEDIUM,
        createdAt: yesterday,
        updatedAt: now,
        category: 'Demo'
      },
      {
        id: 'sample-overdue',
        title: 'Overdue Task Example',
        description: 'This task is overdue and shows the red border and warning indicators.',
        completed: false,
        priority: TaskPriority.HIGH,
        createdAt: yesterday,
        updatedAt: yesterday,
        category: 'Demo',
        dueDate: yesterday
      },
      {
        id: 'sample-due-soon',
        title: 'Due Soon Example',
        description: 'This task is due tomorrow and shows proper due date formatting.',
        completed: false,
        priority: TaskPriority.MEDIUM,
        createdAt: yesterday,
        updatedAt: yesterday,
        category: 'Demo',
        dueDate: tomorrow
      }
    ] as Task[];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Enhanced Task Management Demo
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Experience all the advanced features including task completion with visual feedback, 
          due date management, priority-based sorting, localStorage persistence, and smooth animations.
        </p>
      </div>

      {/* Feature Showcase Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">✨ New Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Task completion with visual feedback
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Due date picker with overdue indicators
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Priority-based sorting controls
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Local storage persistence
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Smooth animations and transitions
          </div>
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <span className="text-green-500">✓</span>
            Enhanced filtering and search
          </div>
        </div>
      </div>

      {/* Sample Task Cards Showcase */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Feature Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getSampleTasks().map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={() => {}} // Demo only - no functionality
              className="opacity-90 cursor-not-allowed"
            />
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          These are example task states showing different visual feedback (demo only - not interactive)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar - Add Task Form */}
        <div className="lg:col-span-1 space-y-6">
          <AddTaskForm
            onTaskCreated={handleTaskCreated}
            initiallyCollapsed={false}
          />

          {/* Filter Component */}
          {availableCategories.length > 0 && (
            <TaskFilter
              filter={{
                status: currentFilter.status,
                ...(currentFilter.priority && { priority: currentFilter.priority }),
                ...(currentFilter.category && { category: currentFilter.category })
              }}
              onFilterChange={(filter) => {
                setCurrentFilter({
                  status: filter.status,
                  priority: filter.priority,
                  category: filter.category,
                  search: currentFilter.search
                });
              }}
              availableCategories={availableCategories}
            />
          )}

          {/* Instructions */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Try These Features:</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Click checkboxes to complete tasks</li>
              <li>• Add tasks with due dates</li>
              <li>• Try different sorting options</li>
              <li>• Use filters to organize tasks</li>
              <li>• Watch for overdue indicators</li>
              <li>• Toggle hide completed tasks</li>
            </ul>
          </div>
        </div>

        {/* Main Content - Task List */}
        <div className="lg:col-span-3">
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onTasksUpdate={setTasks}
            currentFilter={{
              status: currentFilter.status,
              ...(currentFilter.priority && { priority: currentFilter.priority }),
              ...(currentFilter.category && { category: currentFilter.category }),
              ...(currentFilter.search && { search: currentFilter.search })
            }}
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Technical Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Visual Feedback</h3>
            <ul className="space-y-1">
              <li>• Strikethrough text for completed tasks</li>
              <li>• Opacity fade effects with transitions</li>
              <li>• Color-coded priority indicators</li>
              <li>• Overdue task red borders and pulse animation</li>
              <li>• Smooth hover and focus states</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Data Management</h3>
            <ul className="space-y-1">
              <li>• localStorage persistence with error handling</li>
              <li>• Priority-based sorting algorithms</li>
              <li>• Due date validation and formatting</li>
              <li>• User preference storage</li>
              <li>• Automatic timestamps on updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 