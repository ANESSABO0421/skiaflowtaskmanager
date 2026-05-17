import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "review", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  assignee_id: z.string().uuid().optional().or(z.literal("")),
  due_date: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
