"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useMemo, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTaskStore } from "@/store/taskStore";
import { moveTask } from "@/features/tasks/services/taskService";
import type { Task, TaskStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ensureGsapRegistered } from "@/lib/gsap/register";

ensureGsapRegistered();

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "border-zinc-500/30" },
  { id: "in_progress", title: "In Progress", color: "border-blue-500/30" },
  { id: "review", title: "Review", color: "border-amber-500/30" },
  { id: "done", title: "Done", color: "border-emerald-500/30" },
];

function TaskCard({ task, index }: { task: Task; index: number }) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
          className={cn(
            "glass-panel rounded-xl p-4 mb-3 border transition-shadow",
            snapshot.isDragging && "shadow-2xl shadow-pink-500/20",
          )}
        >
          <p className="font-medium text-sm">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <Badge className="mt-3" variant="secondary">
            {task.priority}
          </Badge>
        </div>
      )}
    </Draggable>
  );
}

export default function KanbanBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const moveTaskStore = useTaskStore((s) => s.moveTask);

  const tasksByColumn = useMemo(() => {
    const map = {} as Record<TaskStatus, Task[]>;
    for (const col of COLUMNS) {
      map[col.id] = tasks
        .filter((t) => t.status === col.id)
        .sort((a, b) => a.position - b.position);
    }
    return map;
  }, [tasks]);

  useGSAP(
    () => {
      if (!boardRef.current) return;
      const targets = boardRef.current.querySelectorAll("[data-column]");
      gsap.killTweensOf(targets);
      const tl = gsap.fromTo(
        targets,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" },
      );
      return () => tl.kill();
    },
    { scope: boardRef },
  );

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      moveTaskStore(
        draggableId,
        destination.droppableId as TaskStatus,
        destination.index,
      );
      await moveTask(
        draggableId,
        destination.droppableId as TaskStatus,
        destination.index,
      );
    },
    [moveTaskStore],
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            data-column
            className={cn(
              "flex-shrink-0 w-72 rounded-2xl border bg-black/20 p-3",
              col.color,
            )}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="font-semibold text-sm">{col.title}</h3>
              <span className="text-xs text-muted-foreground">
                {tasksByColumn[col.id].length}
              </span>
            </div>
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[200px]"
                >
                  {tasksByColumn[col.id].map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

