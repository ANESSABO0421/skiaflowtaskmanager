import { create } from "zustand";
import type { Task, TaskStatus } from "@/types/database";

const MAX_TASKS = 500;

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  moveTask: (id: string, status: TaskStatus, position: number) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks: tasks.slice(0, MAX_TASKS) }),
  addTask: (task) =>
    set((s) => {
      if (s.tasks.some((t) => t.id === task.id)) return s;
      return { tasks: [task, ...s.tasks].slice(0, MAX_TASKS) };
    }),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  removeTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  moveTask: (id, status, position) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, status, position } : t,
      ),
    })),
}));

export const selectTasksByStatus = (status: TaskStatus) => (s: TaskState) =>
  s.tasks
    .filter((t) => t.status === status)
    .sort((a, b) => a.position - b.position);
