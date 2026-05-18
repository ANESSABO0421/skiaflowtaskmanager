"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signUp } from "@/features/auth/services/authServices";
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { register: reg, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    const { error } = await signUp(values.email, values.password, values.full_name);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created");
    router.push("/login");
  };

  const field = (label: string, child: React.ReactNode, err?: string) => (
    <div className="space-y-2" data-auth-field>
      <Label>{label}</Label>
      {child}
      {err && <p className="text-xs text-red-400">{err}</p>}
    </div>
  );

  return (
    <AuthLayout title={<>Join <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">SkiaFlow</span></>} subtitle="Create your workspace account">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {field("Full Name", <Input {...reg("full_name")} />, errors.full_name?.message)}
        {field("Email", <Input type="email" {...reg("email")} />, errors.email?.message)}
        {field("Password", <Input type="password" {...reg("password")} />, errors.password?.message)}
        {field("Confirm Password", <Input type="password" {...reg("confirmPassword")} />, errors.confirmPassword?.message)}
        <Button type="submit" disabled={isSubmitting} className="w-full" data-auth-field>{isSubmitting ? "Creating..." : "Register"}<UserPlus className="h-4 w-4" /></Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted-foreground">Have an account? <Link href="/login" className="text-pink-400 hover:underline">Sign in</Link></p>
    </AuthLayout>
  );
}
