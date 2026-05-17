"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useLeadStore } from "@/store/leadStore";
import { leadSchema, type LeadFormValues } from "@/lib/validations/lead";
import { createLeads } from "../services/leadService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeadForm() {
  const user = useAuthStore((s) => s.user);
  const addLead = useLeadStore((s) => s.addLead);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { status: "new" },
  });

  const onSubmit = async (values: LeadFormValues) => {
    if (!user?.id) {
      toast.error("Please sign in before creating a lead");
      return;
    }

    const { data, error } = await createLeads({
      ...values,
      company_name: values.company_name || null,
      email: values.email || null,
      phone: values.phone || null,
      project_type: values.project_type || null,
      budget: values.budget ?? null,
      note: values.note || null,
      created_by: user.id,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      addLead(data);
      reset();
      toast.success("Lead created");
    }
  };

  return (
    <Card data-reveal>
      <CardHeader>
        <CardTitle>Create Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input {...register("client_name")} />
            {errors.client_name && (
              <p className="text-xs text-red-400">{errors.client_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Company</Label>
            <Input {...register("company_name")} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label>Project Type</Label>
            <Input {...register("project_type")} />
          </div>
          <div className="space-y-2">
            <Label>Budget</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register("budget", {
                setValueAs: (value) =>
                  value === "" ? undefined : Number(value),
              })}
            />
            {errors.budget && (
              <p className="text-xs text-red-400">{errors.budget.message}</p>
            )}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Note</Label>
            <Textarea {...register("note")} />
          </div>
          <Button type="submit" disabled={isSubmitting} className="md:col-span-2">
            {isSubmitting ? "Creating..." : "Create Lead"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
