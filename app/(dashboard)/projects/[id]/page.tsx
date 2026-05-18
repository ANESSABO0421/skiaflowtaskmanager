"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProjectById } from "@/features/projects/services/projectService";
import { getComments, createComment } from "@/features/comments/services/commentService";
import { useAuthStore } from "@/store/authStore";
import type { Project, Comment } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all([getProjectById(id), getComments(id)]).then(([proj, comm]) => {
      if (cancelled) return;
      if (proj.data) setProject(proj.data);
      if (comm.data) setComments(comm.data);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const postComment = async () => {
    if (!content.trim() || !user || !id) return;
    const { data, error } = await createComment({
      project_id: id,
      user_id: user.id,
      content,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data) {
      setComments((c) => [...c, data]);
      setContent("");
    }
  };

  if (loading) {
    return (
      <PageWrapper title="Project">
        <Skeleton className="h-48 w-full" />
      </PageWrapper>
    );
  }

  if (!project) {
    return (
      <PageWrapper title="Project not found">
        <Button asChild variant="secondary">
          <Link href="/projects">Back</Link>
        </Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={project.name}
      description={project.description ?? undefined}
      actions={
        <Button asChild variant="secondary">
          <Link href="/projects">Back</Link>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-4">
          <Badge>{project.status}</Badge>
          <p className="text-muted-foreground">{project.description}</p>
          <p className="text-sm">Client: {(project as Project & { clients?: { name: string } }).clients?.name ?? "—"}</p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Activity</h3>
          <div className="flex gap-2 mb-4">
            <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Add comment..." />
            <Button onClick={postComment}>Send</Button>
          </div>
          <AnimatePresence>
            {comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 p-3 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-sm font-medium">{c.profiles?.full_name}</p>
                <p className="text-sm text-muted-foreground">{c.content}</p>
                <p className="text-xs text-muted-foreground mt-1">{formatDate(c.created_at)}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </Card>
      </div>
    </PageWrapper>
  );
}
