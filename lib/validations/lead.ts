import { z } from "zod";

export const leadSchema = z.object({
  client_name: z.string().min(2, "Client name is required"),
  company_name: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  project_type: z.string().optional(),
  budget: z.number().min(0).optional(),
  note: z.string().optional(),
  status: z.enum([
    "new",
    "discussion",
    "proposal_sent",
    "approved",
    "rejected",
    "on_hold",
  ]),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
