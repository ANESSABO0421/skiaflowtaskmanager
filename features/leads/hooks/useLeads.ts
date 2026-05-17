import { useCallback, useEffect } from "react";
import { getLeads } from "../services/leadService";
import { useLeadStore } from "@/store/leadStore";

export const useLeads = () => {
  const leads = useLeadStore((state) => state.leads);
  const setLeads = useLeadStore((state) => state.setLeads);

  const fetchLeads = useCallback(async () => {
    const { data, error } = await getLeads();
    if (error) return;
    if (data) setLeads(data);
  }, [setLeads]);

  useEffect(() => {
    let cancelled = false;
    fetchLeads().then(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
  }, [fetchLeads]);

  return { leads, fetchLeads };
};
