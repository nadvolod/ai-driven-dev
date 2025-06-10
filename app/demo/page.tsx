'use client';

import { useCallback, useState } from 'react';

import { AddTaskForm } from '@/components/AddTaskForm';
import { TaskCard } from '@/components/TaskCard';
import { TaskFilter as TaskFilterComponent } from '@/components/TaskFilter';
import { TaskList } from '@/components/TaskList';
import { generateId } from '@/lib/utils';
import { CreateTaskInput, Task, TaskFilter, TaskPriority, TaskStatus } from '@/types/task';

// Sample tasks for demonstration
const sampleTasks: Task[] = [
  {
    id: generateId(),
    title: "Implement user authentication",
    description: "Set up OAuth integration with Google and GitHub for secure user login. Include proper error handling and user session management.",
    completed: false,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-01-08T10:00:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-09T10:00:00.000Z'), // Fixed timestamp
    category: "Development"
  },
  {
    id: generateId(),
    title: "Design system documentation",
    description: "Create comprehensive documentation for our design system including component guidelines and usage examples.",
    completed: true,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-01-05T10:00:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-07T10:00:00.000Z'), // Fixed timestamp
    category: "Design"
  },
  {
    id: generateId(),
    title: "Team standup meeting",
    completed: true,
    priority: TaskPriority.LOW,
    createdAt: new Date('2025-01-09T10:00:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-09T10:00:00.000Z'), // Fixed timestamp
    category: "Meetings"
  },
  {
    id: generateId(),
    title: "Fix responsive layout issues",
    description: "Address mobile layout problems on the dashboard and task list pages. Test across different devices and screen sizes.",
    completed: false,
    priority: TaskPriority.HIGH,
    createdAt: new Date('2025-01-10T07:00:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-10T07:00:00.000Z'), // Fixed timestamp
    category: "Development"
  },
  {
    id: generateId(),
    title: "Update project README",
    description: "Add installation instructions, API documentation, and contribution guidelines to the main README file.",
    completed: false,
    priority: TaskPriority.MEDIUM,
    createdAt: new Date('2025-01-10T04:00:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-10T04:00:00.000Z'), // Fixed timestamp
    category: "Documentation"
  },
  {
    id: generateId(),
    title: "Code review for PR #123",
    completed: false,
    priority: TaskPriority.LOW,
    createdAt: new Date('2025-01-10T09:30:00.000Z'), // Fixed timestamp
    updatedAt: new Date('2025-01-10T09:30:00.000Z'), // Fixed timestamp
    category: "Development"
  },
];

export default function DemoPage() {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filter, setFilter] = useState<TaskFilter>({
    status: TaskStatus.ALL
  });
  const [loading, setLoading] = useState(false);
  const [showLoadingDemo, setShowLoadingDemo] = useState(false);

  // Get available categories for filter
  const availableCategories = Array.from(
    new Set(tasks.filter(task => task.category).map(task => task.category!))
  );

  // Handler functions
  const handleCreateTask = useCallback(async (taskInput: CreateTaskInput) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newTask: Task = {
      ...taskInput,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
    setLoading(false);
  }, []);

  const handleToggleComplete = useCallback((taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, updatedAt: new Date() }
        : task
    ));
  }, []);

  const handleEditTask = useCallback((updatedTask: Task) => {
    // For demo purposes, we'll just show an alert
    alert(`Edit task: ${updatedTask.title}\n\nIn a real app, this would open an edit form.`);
  }, []);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  }, []);

  const toggleLoadingDemo = () => {
    setShowLoadingDemo(!showLoadingDemo);
  };

  const resetTasks = () => {
    setTasks(sampleTasks);
    setFilter({
      status: TaskStatus.ALL
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Component Demo
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Interactive showcase of our task management components with different states and configurations.
          Try interacting with the components to see how they behave!
        </p>
        
        {/* Demo Controls */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={toggleLoadingDemo}
            className="btn btn-outline btn-sm"
          >
            {showLoadingDemo ? 'Hide' : 'Show'} Loading States
          </button>
          <button
            onClick={resetTasks}
            className="btn btn-outline btn-sm"
          >
            Reset Demo Data
          </button>
          <span className="text-sm text-muted-foreground">
            {tasks.length} tasks • {tasks.filter(t => t.completed).length} completed
          </span>
        </div>
      </div>

      {/* TaskCard Component Demo */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">TaskCard Component</h2>
          <p className="text-muted-foreground">
            Individual task cards showing different priorities, states, and content variations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* High Priority - Incomplete */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">High Priority (Incomplete)</h3>
            <TaskCard
              task={tasks.find(t => t.priority === TaskPriority.HIGH && !t.completed) ?? tasks[0]!}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Medium Priority - Completed */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Medium Priority (Completed)</h3>
            <TaskCard
              task={tasks.find(t => t.priority === TaskPriority.MEDIUM && t.completed) ?? tasks[1]!}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Low Priority - No Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Low Priority (No Description)</h3>
            <TaskCard
              task={tasks.find(t => t.priority === TaskPriority.LOW && !t.description) ?? tasks[2]!}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>
      </section>

      {/* AddTaskForm Component Demo */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">AddTaskForm Component</h2>
          <p className="text-muted-foreground">
            Task creation form with validation, character counters, and loading states
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <AddTaskForm
            onCreateTask={handleCreateTask}
            loading={loading}
          />
        </div>
      </section>

      {/* TaskFilter Component Demo */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">TaskFilter Component</h2>
          <p className="text-muted-foreground">
            Filtering controls with status, priority, and category options
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <TaskFilterComponent
            filter={filter}
            onFilterChange={setFilter}
            availableCategories={availableCategories}
          />
        </div>
      </section>

      {/* TaskList Component Demo */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">TaskList Component</h2>
          <p className="text-muted-foreground">
            Complete task list with filtering, sorting, and state management
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggleComplete={handleToggleComplete}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            loading={showLoadingDemo}
          />
        </div>
      </section>

      {/* Empty State Demo */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Empty States</h2>
          <p className="text-muted-foreground">
            How components look when there's no data to display
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Empty Task List */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">Empty Task List</h3>
            <TaskList
              tasks={[]}
              filter={{ status: TaskStatus.ALL }}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={false}
            />
          </div>

          {/* Filtered Empty State */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-foreground">No Results for Filter</h3>
            <TaskList
              tasks={tasks}
              filter={{ status: TaskStatus.ALL, priority: TaskPriority.HIGH, category: "NonExistent" }}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={false}
            />
          </div>
        </div>
      </section>

      {/* Component Variations */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Component Variations</h2>
          <p className="text-muted-foreground">
            Different ways components can be styled and configured
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Compact TaskCard */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Compact Layout</h3>
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  className="scale-90 origin-left"
                />
              ))}
            </div>
          </div>

          {/* Priority Focused */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Priority Showcase</h3>
            <div className="space-y-3">
              {[TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW].map(priority => {
                const baseTask = tasks.find(t => t.priority === priority);
                if (!baseTask) return null;
                
                return (
                  <TaskCard
                    key={`${baseTask.id}-${priority}`}
                    task={{ ...baseTask, priority }}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground">
          This demo showcases the complete task management component library.
          All components are fully interactive and demonstrate real-world usage patterns.
        </p>
      </div>
    </div>
  );
} 