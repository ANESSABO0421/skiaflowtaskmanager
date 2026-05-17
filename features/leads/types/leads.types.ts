export type LeadStatus =
  | "new"
  | "discussion"
  | "proposal_sent"
  | "approved"
  | "rejected"
  | "on_hold";

export interface Lead {
  id: string;

  client_name: string;
  company_name: string;

  email: string;
  phone: string;

  project_type: string;

  budget: number;

  status: LeadStatus;

  note: string;

  created_by: string;

  created_at: string;
}
