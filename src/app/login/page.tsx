"use client";

import React from "react";
import { Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Only import Clerk if we might need it, to avoid side effects
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    // Demo mode check
    const isDemoMode = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === "" || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes("test_");

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
                                    Clerk Auth is disabled for this offline preview. You can enter the workspace directly.
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
                        <div className="w-full">
                            <SignIn
                                routing="hash"
                                signUpUrl="/login"
                                forceRedirectUrl="/onboarding"
                            />
                        </div>
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
