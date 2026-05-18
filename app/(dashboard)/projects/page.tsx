"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import PageWrapper from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjectStore } from "@/store/projectStore";
import { projectSchema, type ProjectFormValues } from "@/lib/validations/project";
import { createProject, deleteProject, getProjects } from "@/features/projects/services/projectService";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export default function ProjectsPage() {
  const revealRef = useGsapReveal();
  const projects = useProjectStore((s) => s.projects);
  const setProjects = useProjectStore((s) => s.setProjects);
  const addProject = useProjectStore((s) => s.addProject);
  const removeProject = useProjectStore((s) => s.removeProject);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: { status: "planning" },
  });

  useEffect(() => {
    let cancelled = false;
    getProjects().then(({ data }) => {
      if (!cancelled && data) setProjects(data);
    });
    return () => {
      cancelled = true;
    };
  }, [setProjects]);

  const onSubmit = async (values: ProjectFormValues) => {
    const { data, error } = await createProject({
      ...values,
      description: values.description || null,
      client_id: values.client_id || null,
      budget: values.budget ?? null,
      start_date: values.start_date || null,
      end_date: values.end_date || null,
    });
    if (error) return toast.error(error.message);
    if (data) { addProject(data); reset(); toast.success("Project created"); }
  };

  return (
    <PageWrapper title="Projects" description="Track and manage all projects">
      <div ref={revealRef} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-1" data-reveal>
          <CardHeader><CardTitle>New Project</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input {...register("name")} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea {...register("description")} /></div>
              <div className="space-y-2"><Label>Budget</Label><Input
                type="number"
                min="0"
                step="0.01"
                {...register("budget", {
                  setValueAs: (value) =>
                    value === "" ? undefined : Number(value),
                })}
              /></div>
              <Button type="submit" disabled={isSubmitting} className="w-full">Create</Button>
            </form>
          </CardContent>
        </Card>
        <div className="xl:col-span-2 grid gap-4" data-reveal>
          {projects.map((p) => (
            <Card key={p.id} className="p-5 flex justify-between items-start hover:border-pink-500/30 transition-colors" data-reveal>
              <div>
                <Link href={`/projects/${p.id}`} className="text-lg font-semibold hover:text-pink-400">{p.name}</Link>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
                <Badge className="mt-2">{p.status}</Badge>
              </div>
              <Button variant="destructive" size="sm" onClick={async () => { await deleteProject(p.id); removeProject(p.id); }}>Delete</Button>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
