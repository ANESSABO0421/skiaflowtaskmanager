"use client";

import { useState } from "react";

import { useLeadStore } from "@/store/leadStore";

import { useAuthStore } from "@/store/authStore";
import { createLeads } from "../services/leadService";

export default function LeadForm() {
  const user = useAuthStore((state) => state.user);

  const addLead = useLeadStore((state) => state.addLead);

  const [formData, setFormData] = useState({
    client_name: "",
    company_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,

      budget: Number(formData.budget),

      created_by: user?.id,
    };

    const { data, error } = await createLeads(payload);

    if (error) {
      alert(error.message);
      return;
    }

    addLead(data);

    setFormData({
      client_name: "",
      company_name: "",
      email: "",
      phone: "",
      project_type: "",
      budget: "",
      note: "",
    });
  };

  return (
    <div className="border rounded-2xl p-6 space-y-4">
      <h2 className="text-2xl font-bold">Create Lead</h2>

      <input
        name="client_name"
        value={formData.client_name}
        onChange={handleChange}
        placeholder="Client Name"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="company_name"
        value={formData.company_name}
        onChange={handleChange}
        placeholder="Company Name"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="project_type"
        value={formData.project_type}
        onChange={handleChange}
        placeholder="Project Type"
        className="w-full border p-3 rounded-lg"
      />

      <input
        name="budget"
        value={formData.budget}
        onChange={handleChange}
        placeholder="Budget"
        className="w-full border p-3 rounded-lg"
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-5 py-3 rounded-xl"
      >
        Create Lead
      </button>
    </div>
  );
}
