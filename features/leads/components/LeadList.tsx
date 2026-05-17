"use client";

import { useLeads } from "../hooks/useLeads";

import LeadCard from "./LeadCard";

export default function LeadList() {
  const { leads } = useLeads();

  if (!leads.length) {
    return <div>No leads found</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-5">
      {leads.map((lead) => (
        <LeadCard key={lead.id} lead={lead} />
      ))}
    </div>
  );
}
