"use client";

import { deleteLeads, updateLeads } from "../services/leadService";
import type { Lead, LeadStatus } from "../types/leads.types";
import LeadStatusBadge from "./LeadStatusBadge";
import { useLeadStore } from "@/store/leadStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function LeadCard({ lead }: { lead: Lead }) {
  const removeLead = useLeadStore((s) => s.removeLead);
  const updateLeadStore = useLeadStore((s) => s.updateLead);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as LeadStatus;
    const { error } = await updateLeads(lead.id, { status });
    if (error) {
      toast.error(error.message);
      return;
    }
    updateLeadStore(lead.id, { status });
  };

  return (
    <Card
      data-reveal
      className="p-5 space-y-4 hover:border-pink-500/30 transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02]"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{lead.client_name}</h2>
        <LeadStatusBadge status={lead.status} />
      </div>
      <div className="space-y-1 text-sm text-muted-foreground">
        {lead.company_name && <p>{lead.company_name}</p>}
        {lead.email && <p>{lead.email}</p>}
        {lead.project_type && <p>{lead.project_type}</p>}
        {lead.budget != null && (
          <p className="text-foreground font-medium">
            {formatCurrency(Number(lead.budget))}
          </p>
        )}
      </div>
      <select
        value={lead.status}
        onChange={handleStatusChange}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm"
      >
        <option value="new">New</option>
        <option value="discussion">Discussion</option>
        <option value="proposal_sent">Proposal Sent</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="on_hold">On Hold</option>
      </select>
      <Button
        variant="destructive"
        size="sm"
        className="w-full"
        onClick={async () => {
          if (!confirm("Delete lead?")) return;
          const { error } = await deleteLeads(lead.id);
          if (error) {
            toast.error(error.message);
            return;
          }
          removeLead(lead.id);
          toast.success("Lead deleted");
        }}
      >
        Delete
      </Button>
    </Card>
  );
}
