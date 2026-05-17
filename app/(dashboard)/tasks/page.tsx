"use client";
import { useEffect } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import KanbanBoard from "@/features/tasks/components/KanbanBoard";
import { getTasks } from "@/features/tasks/services/taskService";
import { useTaskStore } from "@/store/taskStore";
import { useRealtime } from "@/hooks/useRealtime";
import type { Task } from "@/types/database";

export default function TasksPage() {
  const setTasks = useTaskStore((s) => s.setTasks);
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  useEffect(() => { getTasks().then(({ data }) => data && setTasks(data)); }, [setTasks]);

  useRealtime<Task>("tasks", undefined, (t) => addTask(t), (t) => updateTask(t.id, t));

  return (
    <PageWrapper title="Tasks" description="Kanban board with realtime updates">
      <KanbanBoard />
    </PageWrapper>
  );
}