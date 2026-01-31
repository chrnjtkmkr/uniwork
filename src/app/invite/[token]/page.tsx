"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { acceptInvitation } from "@/actions/invitations";
import { getCurrentUser, syncUser } from "@/actions/auth";
import { toast } from "sonner";

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function checkUser() {
            // Ensure user is synced/logged in
            let u = await getCurrentUser() as any;
            if (!u) {
                u = await syncUser();
            }
            setUser(u);
            setLoading(false);
        }
        checkUser();
    }, []);

    const handleJoin = async () => {
        if (!params.token || !user) return;
        setJoining(true);
        const result = await acceptInvitation(params.token as string, user.id);

        if (result.success) {
            toast.success("Neural synchronization established.");
            router.push("/dashboard");
        } else {
            toast.error(result.error || "Signal handshake failed.");
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#3B82F6] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)]">
            <div className="max-w-md w-full bg-[#0f0f0f] border border-white/5 rounded-[40px] p-12 text-center space-y-10 shadow-2xl relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent"></div>

                <div className="space-y-4">
                    <div className="w-20 h-20 bg-[#3B82F6]/10 rounded-3xl flex items-center justify-center mx-auto border border-[#3B82F6]/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                        <Zap className="w-10 h-10 text-[#3B82F6]" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter italic uppercase">
                        Neural <span className="text-[#3B82F6]">Link</span>
                    </h1>
                </div>

                <div className="space-y-6">
                    <p className="text-slate-400 font-medium italic text-lg leading-relaxed">
                        You have been summoned to join a new <span className="text-white font-black">Workspace Nexus</span>. Re-align your neural frequency to proceed.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                            <Shield className="w-4 h-4 text-[#3B82F6] mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Protocol</p>
                            <p className="text-xs font-bold text-white uppercase italic">Encrypted</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-1">
                            <Globe className="w-4 h-4 text-[#3B82F6] mx-auto mb-2" />
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Signal</p>
                            <p className="text-xs font-bold text-white uppercase italic">Stable</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleJoin}
                    disabled={joining}
                    className="w-full h-20 bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90 rounded-[30px] font-black italic text-2xl tracking-tighter transition-all uppercase shadow-[0_10px_40px_rgba(59,130,246,0.3)]"
                >
                    {joining ? <Loader2 className="w-8 h-8 animate-spin" /> : "ESTABLISH CONNECTION"}
                </Button>

                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
                    Authorized Personnel Only — {user?.email || "GUEST"}
                </p>
            </div>
        </div>
    );
}
