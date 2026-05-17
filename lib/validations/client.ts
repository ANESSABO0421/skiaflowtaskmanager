import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["active", "inactive", "archived"]),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
