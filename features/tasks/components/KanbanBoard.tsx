"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { useTaskStore, selectTasksByStatus } from "@/store/taskStore";
import { moveTask } from "@/features/tasks/services/taskService";
import type { Task, TaskStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "border-zinc-500/30" },
  { id: "in_progress", title: "In Progress", color: "border-blue-500/30" },
  { id: "review", title: "Review", color: "border-amber-500/30" },
  { id: "done", title: "Done", color: "border-emerald-500/30" },
];

function TaskCard({ task, index }: { task: Task; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={(el) => {
            provided.innerRef(el);
            (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          }}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "glass-panel rounded-xl p-4 mb-3 border transition-shadow",
            snapshot.isDragging && "shadow-2xl shadow-pink-500/20 scale-[1.02]",
          )}
          onMouseEnter={() => {
            if (cardRef.current)
              gsap.to(cardRef.current, { y: -4, duration: 0.2, ease: "power2.out" });
          }}
          onMouseLeave={() => {
            if (cardRef.current && !snapshot.isDragging)
              gsap.to(cardRef.current, { y: 0, duration: 0.2, ease: "power2.out" });
          }}
        >
          <p className="font-medium text-sm">{task.title}</p>
          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <Badge
              variant={
                task.priority === "urgent"
                  ? "destructive"
                  : task.priority === "high"
                    ? "warning"
                    : "secondary"
              }
            >
              {task.priority}
            </Badge>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function KanbanBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const tasks = useTaskStore((s) => s.tasks);
  const moveTaskStore = useTaskStore((s) => s.moveTask);

  useGSAP(
    () => {
      if (!boardRef.current) return;
      gsap.fromTo(
        boardRef.current.querySelectorAll("[data-column]"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" },
      );
    },
    { scope: boardRef },
  );

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    const position = destination.index;

    moveTaskStore(draggableId, newStatus, position);
    await moveTask(draggableId, newStatus, position);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div ref={boardRef} className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const columnTasks = tasks
            .filter((t) => t.status === col.id)
            .sort((a, b) => a.position - b.position);

          return (
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
                  {columnTasks.length}
                </span>
              </div>
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[200px]"
                  >
                    {columnTasks.map((task, index) => (
                      <TaskCard key={task.id} task={task} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}

