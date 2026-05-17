"use client";

import { useCallback, useEffect } from "react";
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

  useEffect(() => {
    let cancelled = false;
    getTasks().then(({ data }) => {
      if (!cancelled && data) setTasks(data);
    });
    return () => {
      cancelled = true;
    };
  }, [setTasks]);

  const onInsert = useCallback((t: Task) => addTask(t), [addTask]);
  const onUpdate = useCallback(
    (t: Task) => updateTask(t.id, t),
    [updateTask],
  );

  useRealtime<Task>("tasks", undefined, onInsert, onUpdate);

  return (
    <PageWrapper title="Tasks" description="Kanban board with realtime updates">
      <KanbanBoard />
    </PageWrapper>
  );
}
