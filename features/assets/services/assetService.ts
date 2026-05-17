import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function getAssets(projectId?: string) {
  let query = supabase.from("assets").select("*").order("created_at", { ascending: false });
  if (projectId) query = query.eq("project_id", projectId);
  return query;
}

export async function uploadAsset(
  file: File,
  projectId: string | null,
  userId: string,
) {
  const path = `${userId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("assets")
    .upload(path, file);

  if (uploadError) return { data: null, error: uploadError };

  return supabase
    .from("assets")
    .insert([
      {
        name: file.name,
        file_path: path,
        file_type: file.type,
        file_size: file.size,
        project_id: projectId,
        uploaded_by: userId,
      },
    ])
    .select()
    .single();
}

export async function getSignedUrl(path: string) {
  return supabase.storage.from("assets").createSignedUrl(path, 3600);
}

export async function deleteAsset(id: string, path: string) {
  await supabase.storage.from("assets").remove([path]);
  return supabase.from("assets").delete().eq("id", id);
}
