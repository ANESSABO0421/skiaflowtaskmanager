import { useEffect } from "react";

import { getLeads } from "../services/leadService";

import { useLeadStore } from "@/store/leadStore";

export const useLeads = () => {
  const leads = useLeadStore((state) => state.leads);

  const setLeads = useLeadStore((state) => state.setLeads);

  const fetchLeads = async () => {
    const { data, error } = await getLeads();

    if (error) {
      console.log(error);
      return;
    }

    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return {
    leads,
    fetchLeads,
  };
};
