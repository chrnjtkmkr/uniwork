"use client";

import React, { useState } from "react";
import { Zap, ArrowRight, ShieldCheck, Mail, Lock, Loader2, Github } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL;

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[480px] z-10 flex flex-col items-center"
            >
                <div className="text-center mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,212,170,0.3)]">
                        <Zap className="text-black w-8 h-8 fill-current" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">UniWork Workspace</h1>
                    <p className="text-muted-foreground mt-2">Log in to your secure digital universe.</p>
                </div>

                <div className="w-full space-y-6">
                    {isDemoMode ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass border-primary/20 bg-primary/5 p-8 rounded-[40px] text-center space-y-8 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="w-16 h-16 rounded-[24px] bg-primary/20 flex items-center justify-center mx-auto text-primary relative">
                                <ShieldCheck className="w-8 h-8" />
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black italic tracking-tighter">Demo Mode Active</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                    Supabase Auth is not configured for this preview. You can enter the workspace directly.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button asChild className="w-full h-16 bg-primary text-black hover:bg-primary/90 text-xl font-black rounded-2xl shadow-[0_4px_30px_rgba(0,212,170,0.3)] transition-all hover:scale-[1.02] active:scale-95">
                                    <Link href="/onboarding">Enter Dashboard <ArrowRight className="ml-2 w-6 h-6" /></Link>
                                </Button>

                                <div className="flex items-center justify-center gap-2 py-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] text-primary/70 font-black uppercase tracking-[0.2em]">Local Data Storage Ready</span>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <AuthForm />
                    )}
                </div>

                {/* Footer Meta */}
                <div className="mt-12 flex items-center justify-center gap-6 text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
                    <Link href="/" className="hover:text-primary transition-colors">Back to Home</Link>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
                </div>
            </motion.div>
        </div>
    );
}

function AuthForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = mode === "signIn"
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({ email, password });

        if (error) {
            toast.error(error.message);
        } else {
            toast.success(mode === "signIn" ? "Welcome back, Operator." : "Link established. Check your email.");
            if (mode === "signIn") router.push("/onboarding");
        }
        setLoading(false);
    };

    const handleSocialAuth = async (provider: 'github' | 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
        if (error) toast.error(error.message);
    };

    return (
        <div className="w-full space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Identity frequency</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="email"
                            placeholder="OPERATOR@NEURAL.LINK"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-xl focus:border-primary/50 transition-all font-bold italic"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Authorization key</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-white/5 border-white/10 h-14 pl-12 rounded-xl focus:border-primary/50 transition-all font-bold"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-primary text-black hover:bg-primary/90 rounded-xl font-black italic text-lg tracking-tight shadow-[0_4px_20px_rgba(0,212,170,0.2)]"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === "signIn" ? "Establish Sync" : "Initialize Node"}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/5"></span>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                    <span className="bg-[#0A0A0A] px-4 text-muted-foreground">Alternate frequencies</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button
                    onClick={() => handleSocialAuth('github')}
                    variant="outline"
                    className="h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                    <Github className="w-5 h-5 mr-2" /> GitHub
                </Button>
                <Button
                    onClick={() => handleSocialAuth('google')}
                    variant="outline"
                    className="h-14 border-white/10 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                </Button>
            </div>

            <div className="text-center">
                <button
                    onClick={() => setMode(mode === "signIn" ? "signUp" : "signIn")}
                    className="text-xs font-bold text-primary hover:underline decoration-primary/30 underline-offset-4"
                >
                    {mode === "signIn" ? "Need a new identity? Request access." : "Already authorized? Establish sync."}
                </button>
            </div>
        </div>
    );
}
