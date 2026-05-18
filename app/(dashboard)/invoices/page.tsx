"use client";
import { useEffect, useState } from "react";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInvoices } from "@/features/invoices/services/invoiceService";
import type { Invoice } from "@/types/database";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export default function InvoicesPage() {
  const revealRef = useGsapReveal();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    let cancelled = false;
    getInvoices().then(({ data }) => {
      if (!cancelled && data) setInvoices(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PageWrapper title="Invoices" description="Manage billing and payments">
      <div ref={revealRef} className="space-y-3">
        {invoices.map((inv) => (
          <Card key={inv.id} data-reveal className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold">{inv.invoice_number}</p>
              <p className="text-sm text-muted-foreground">{inv.clients?.name} · {formatDate(inv.issued_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-bold">{formatCurrency(Number(inv.amount))}</p>
              <Badge>{inv.status}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  );
}
