"use client";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "@/features/auth/services/profileService";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [name, setName] = useState(profile?.full_name ?? "");

  const save = async () => {
    if (!profile) return;
    const { data, error } = await updateProfile(profile.id, { full_name: name });
    if (error) return toast.error(error.message);
    if (data) { setProfile(data); toast.success("Profile updated"); }
  };

  return (
    <PageWrapper title="Settings" description="Manage your account">
      <Card className="max-w-lg">
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Full Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={profile?.email ?? ""} disabled /></div>
          <div className="space-y-2"><Label>Role</Label><Input value={profile?.role ?? ""} disabled /></div>
          <Button onClick={save}>Save Changes</Button>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}