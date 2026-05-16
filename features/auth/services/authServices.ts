import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export const signUp = async (
  email: string,
  password: string,
  fullName: string,
) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_Name: fullName,
      },
    },
  });
};

export const signIn = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
