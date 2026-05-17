"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getClientById } from "@/features/clients/services/clientService";
import type { Client, Project } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getClientById(id).then(({ data }) => {
      if (data) {
        setClient(data);
        setProjects((data as Client & { projects?: Project[] }).projects ?? []);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <PageWrapper title="Client">
        <Skeleton className="h-48 w-full" />
      </PageWrapper>
    );
  }

  if (!client) {
    return (
      <PageWrapper title="Client not found">
        <Button asChild variant="secondary">
          <Link href="/clients">Back to clients</Link>
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={client.name}
      description={client.company ?? undefined}
      actions={
        <Button asChild variant="secondary">
          <Link href="/clients">Back</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <Badge>{client.status}</Badge>
          <p className="text-sm">{client.email}</p>
          <p className="text-sm">{client.phone}</p>
          <p className="text-sm text-muted-foreground">{client.notes}</p>
          <p className="text-xs text-muted-foreground">Since {formatDate(client.created_at)}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Linked Projects</h3>
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects linked</p>
          ) : (
            <ul className="space-y-2">
              {projects.map((p) => (
                <li key={p.id}>
                  <Link href={`/projects/${p.id}`} className="text-pink-400 hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}
