import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  description: z.string().optional(),
  client_id: z.string().uuid().optional().or(z.literal("")),
  status: z.enum(["planning", "active", "on_hold", "completed", "cancelled"]),
  budget: z.union([z.number(), z.nan()]).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;
