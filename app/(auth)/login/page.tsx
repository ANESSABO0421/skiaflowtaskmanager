"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/auth/AuthLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signIn } from "@/features/auth/services/authServices";
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await signIn(values.email, values.password);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    router.push("/dashboard");
  };

  return (
    <AuthLayout title={<>Where ideas <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">become interfaces</span></>} subtitle="Sign in to your SkiaFlow workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2" data-auth-field>
          <Label>Email</Label>
          <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-11" type="email" {...register("email")} placeholder="name@company.com" /></div>
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div className="space-y-2" data-auth-field>
          <Label>Password</Label>
          <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input className="pl-11" type="password" {...register("password")} placeholder="••••••••" /></div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full" data-auth-field>{isSubmitting ? "Signing in..." : "Login"}{!isSubmitting && <ArrowRight className="h-4 w-4" />}</Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted-foreground">Don&apos;t have an account? <Link href="/register" className="text-pink-400 hover:underline">Register</Link></p>
    </AuthLayout>
  );
}
