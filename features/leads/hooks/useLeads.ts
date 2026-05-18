import { useCallback, useEffect, useRef } from "react";
import { getLeads } from "../services/leadService";
import { useLeadStore } from "@/store/leadStore";

export const useLeads = () => {
  const leads = useLeadStore((state) => state.leads);
  const setLeads = useLeadStore((state) => state.setLeads);
  const fetchIdRef = useRef(0);

  const fetchLeads = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    const { data, error } = await getLeads();
    if (error) return;
    if (data && fetchId === fetchIdRef.current) setLeads(data);
  }, [setLeads]);

  useEffect(() => {
    void fetchLeads();
    return () => {
      fetchIdRef.current += 1;
    };
  }, [fetchLeads]);

  return { leads, fetchLeads };
};
