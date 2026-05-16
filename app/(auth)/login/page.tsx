"use client";
import { signIn } from "@/features/auth/services/authServices";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react"; 
import Link from "next/link";
const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      alert(error.message);
      return;
    }
    router.push("/");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#050106] overflow-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(219,39,119,0.15),transparent_45%)]" />
      <div className="absolute bottom-0 right-0 w-full h-[60%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(219,39,119,0.1),transparent_60%)]" />

      <div className="relative w-full max-w-md mx-4 p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl shadow-pink-950/20">
        
        <div className="mb-8 space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-light tracking-tight text-white/90">
            Where ideas <br />
            <span className="font-normal text-white">turns into </span>
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-400">
              interfaces.
            </span>
          </h1>
          <p className="text-sm text-neutral-400">Sign in to your dashboard to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-neutral-400 block px-1">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-medium uppercase tracking-wider text-neutral-400 block">
                Password
              </label>
              <a href="#" className="text-xs text-pink-400/80 hover:text-pink-400 transition-colors">
                Forgot password?
              </a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-pink-500 transition-colors" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-white/10 bg-black/40 text-white placeholder-neutral-600 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-medium text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-pink-600/20 transition-all duration-200 cursor-pointer"
          >
            {isLoading ? "Signing in..." : "Login"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-pink-400/80 hover:text-pink-400 underline underline-offset-4 font-medium transition-colors">
              Request access
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;