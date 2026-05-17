"use client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { getAssets, uploadAsset } from "@/features/assets/services/assetService";
import type { Asset } from "@/types/database";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export default function AssetsPage() {
  const revealRef = useGsapReveal();
  const user = useAuthStore((s) => s.user);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { getAssets().then(({ data }) => data && setAssets(data)); }, []);

  const onUpload = async (files: FileList | null) => {
    if (!files?.length || !user) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const { data, error } = await uploadAsset(file, null, user.id);
      if (error) toast.error(error.message);
      else if (data) setAssets((a) => [data, ...a]);
    }
    setUploading(false);
    toast.success("Upload complete");
  };

  return (
    <PageWrapper title="Assets" description="Upload and manage project assets">
      <div ref={revealRef}>
        <Card data-reveal className="p-8 border-dashed border-2 text-center cursor-pointer hover:border-pink-500/50 transition-colors" onClick={() => inputRef.current?.click()}>
          <p className="text-muted-foreground">{uploading ? "Uploading..." : "Drop files or click to upload"}</p>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
        </Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {assets.map((a) => (
            <Card key={a.id} data-reveal className="p-4 hover:scale-[1.02] transition-transform">
              <p className="font-medium truncate">{a.name}</p>
              <p className="text-xs text-muted-foreground">{a.file_type}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}