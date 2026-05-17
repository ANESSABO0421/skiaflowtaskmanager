"use client";

import { Input } from "@/components/ui/input";
import { useLeadStore } from "@/store/leadStore";
import type { LeadStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const statuses: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "discussion", label: "Discussion" },
  { value: "proposal_sent", label: "Proposal" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "on_hold", label: "On Hold" },
];

export default function LeadFilters() {
  const statusFilter = useLeadStore((s) => s.statusFilter);
  const searchQuery = useLeadStore((s) => s.searchQuery);
  const setStatusFilter = useLeadStore((s) => s.setStatusFilter);
  const setSearchQuery = useLeadStore((s) => s.setSearchQuery);

  return (
    <div className="flex flex-col sm:flex-row gap-4" data-reveal>
      <Input
        placeholder="Search leads..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="sm:max-w-xs"
      />
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatusFilter(s.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              statusFilter === s.value
                ? "bg-pink-500/20 border-pink-500/40 text-pink-300"
                : "border-white/10 text-muted-foreground hover:bg-white/5",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
