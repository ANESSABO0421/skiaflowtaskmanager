"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClientStore } from "@/store/clientStore";
import { clientSchema, type ClientFormValues } from "@/lib/validations/client";
import { createClientRecord, deleteClient, getClients } from "@/features/clients/services/clientService";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { formatDate } from "@/lib/utils";

export default function ClientsPage() {
  const revealRef = useGsapReveal();
  const clients = useClientStore((s) => s.clients);
  const setClients = useClientStore((s) => s.setClients);
  const addClient = useClientStore((s) => s.addClient);
  const removeClient = useClientStore((s) => s.removeClient);
  const [search, setSearch] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { status: "active" },
  });

  useEffect(() => {
    getClients().then(({ data }) => data && setClients(data));
  }, [setClients]);

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = async (values: ClientFormValues) => {
    const { data, error } = await createClientRecord({
      ...values,
      company: values.company || null,
      email: values.email || null,
      phone: values.phone || null,
      website: values.website || null,
      notes: values.notes || null,
    });
    if (error) { toast.error(error.message); return; }
    if (data) { addClient(data); reset(); toast.success("Client created"); }
  };

  return (
    <PageWrapper title="Clients" description="Manage your client relationships">
      <div ref={revealRef} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1" data-reveal>
          <CardHeader><CardTitle>Add Client</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input {...register("name")} placeholder="Client name" />{errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}</div>
              <div className="space-y-2"><Label>Company</Label><Input {...register("company")} placeholder="Company" /></div>
              <div className="space-y-2"><Label>Email</Label><Input {...register("email")} type="email" placeholder="email@company.com" /></div>
              <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? "Creating..." : "Create Client"}</Button>
            </form>
          </CardContent>
        </Card>
        <div className="xl:col-span-2 space-y-4" data-reveal>
          <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="grid gap-3">
            {filtered.length === 0 ? <Card className="p-12 text-center text-muted-foreground">No clients yet.</Card> : filtered.map((client) => (
              <Card key={client.id} className="p-4 flex items-center justify-between hover:border-pink-500/30 transition-colors">
                <div>
                  <Link href={`/clients/${client.id}`} className="font-semibold hover:text-pink-400">{client.name}</Link>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(client.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={client.status === "active" ? "success" : "secondary"}>{client.status}</Badge>
                  <Button variant="destructive" size="sm" onClick={async () => { await deleteClient(client.id); removeClient(client.id); toast.success("Deleted"); }}>Delete</Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
