import { create } from "zustand";
import type { Project } from "@/types/database";

const MAX_PROJECTS = 500;

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  setProjects: (projects: Project[]) => void;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  activeProjectId: null,
  setProjects: (projects) => set({ projects: projects.slice(0, MAX_PROJECTS) }),
  setActiveProjectId: (id) => set({ activeProjectId: id }),
  addProject: (project) =>
    set((s) => ({ projects: [project, ...s.projects].slice(0, MAX_PROJECTS) })),
  updateProject: (id, updates) =>
    set((s) => ({
      projects: s.projects.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),
  removeProject: (id) =>
    set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),
}));
