export type UserRole = "super_admin" | "developer" | "designer" | "client";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

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
  company_name: string | null;
  email: string | null;
  phone: string | null;
  project_type: string | null;
  budget: number | null;
  status: LeadStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
}

export type ClientStatus = "active" | "inactive" | "archived";

export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  status: ClientStatus;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
}

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  status: ProjectStatus;
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
  clients?: { name: string; company: string | null } | null;
}

export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string | null;
  position: number;
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

export interface Comment {
  id: string;
  project_id: string | null;
  task_id: string | null;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
  profiles?: { full_name: string | null; avatar_url: string | null } | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string | null;
  type: "info" | "success" | "warning" | "mention" | "task" | "invoice";
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface Asset {
  id: string;
  project_id: string | null;
  name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  created_at: string;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  client_id: string | null;
  project_id: string | null;
  invoice_number: string;
  amount: number;
  status: InvoiceStatus;
  due_date: string | null;
  issued_at: string;
  created_by: string | null;
  created_at: string;
  updated_at?: string;
  clients?: { name: string } | null;
}

export interface Activity {
  id: string;
  user_id: string | null;
  entity_type: string;
  entity_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  profiles?: { full_name: string | null } | null;
}
