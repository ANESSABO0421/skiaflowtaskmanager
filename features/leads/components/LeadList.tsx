"use client";

import { useMemo } from "react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { useLeadStore } from "@/store/leadStore";
import LeadCard from "./LeadCard";
import LeadFilters from "./LeadFilters";
import { Card } from "@/components/ui/card";
import { useLeads } from "../hooks/useLeads";

export default function LeadList() {
  useLeads();
  const revealRef = useGsapReveal();
  const allLeads = useLeadStore((s) => s.leads);
  const statusFilter = useLeadStore((s) => s.statusFilter);
  const searchQuery = useLeadStore((s) => s.searchQuery);

  const leads = useMemo(() => {
    let result = allLeads;
    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (lead) =>
          lead.client_name.toLowerCase().includes(query) ||
          lead.company_name?.toLowerCase().includes(query) ||
          lead.email?.toLowerCase().includes(query),
      );
    }
    return result;
  }, [allLeads, statusFilter, searchQuery]);

  return (
    <div ref={revealRef} className="space-y-6">
      <LeadFilters />
      {leads.length === 0 ? (
        <Card className="p-16 text-center" data-reveal>
          <p className="text-lg font-medium">No leads found</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create your first lead or adjust filters
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
