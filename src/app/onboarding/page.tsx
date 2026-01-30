"use client";

import React, { useState, useEffect } from "react";
import {
    Zap,
    ArrowRight,
    Check,
    Rocket,
    Users,
    Layout,
    Briefcase,
    GraduationCap,
    CheckCircle2,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { syncUser, updateUserProfile } from "@/actions/auth";
import { createWorkspace } from "@/actions/workspaces";
import { cn } from "@/lib/utils";

const steps = [
    { id: 1, title: "Your Profile", subtitle: "Tell us who you are" },
    { id: 2, title: "Your Vibe", subtitle: "Select your workspace type" },
    { id: 3, title: "Workspace", subtitle: "Name your digital home" },
    { id: 4, title: "Success!", subtitle: "Ready to launch" },
];

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        workspaceName: ""
    });
    const router = useRouter();

    useEffect(() => {
        async function init() {
            const dbUser = await syncUser();
            if (dbUser) {
                setUser(dbUser);
                setFormData(prev => ({ ...prev, name: dbUser.name || "" }));
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleNext = async () => {
        if (currentStep === 1) {
            // No need to save yet, just move to type selection
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Moving to workspace name
            setCurrentStep(3);
        } else if (currentStep === 3) {
            // Finalizing: Save profile and create workspace
            setIsSaving(true);
            try {
                if (user) {
                    await updateUserProfile(user.id, {
                        name: formData.name,
                        bio: `A ${formData.type} explorer on a mission to optimize productivity.`
                    });

                    await createWorkspace({
                        name: formData.workspaceName,
                        ownerId: user.id
                    });
                }
                setCurrentStep(4);
            } catch (error) {
                console.error("Onboarding error:", error);
            } finally {
                setIsSaving(false);
            }
        } else {
            router.push('/dashboard');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full" />

            {/* Progress */}
            <div className="mb-12 flex items-center gap-4 z-10 transition-all">
                {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2">
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-700 border",
                            currentStep > step.id
                                ? 'bg-primary text-black border-primary shadow-[0_0_20px_rgba(0,212,170,0.5)]'
                                : currentStep === step.id
                                    ? 'bg-primary/20 text-primary border-primary/40 shadow-[0_0_20px_rgba(0,212,170,0.2)]'
                                    : 'bg-white/5 text-muted-foreground border-white/5 opacity-40'
                        )}>
                            {currentStep > step.id ? <Check className="w-6 h-6 stroke-[4px]" /> : step.id}
                        </div>
                        {step.id !== 4 && (
                            <div className={cn(
                                "w-6 md:w-12 h-1 rounded-full transition-all duration-700",
                                currentStep > step.id ? 'bg-primary' : 'bg-white/10'
                            )} />
                        )}
                    </div>
                ))}
            </div>

            <div className="relative z-10 w-full max-w-xl">
                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10 text-center"
                        >
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                                    Initiating <span className="text-primary italic">Protocol</span>
                                </h1>
                                <p className="text-muted-foreground text-lg font-medium">Identify yourself to the universal neural network.</p>
                            </div>
                            <Card className="glass border-white/10 p-2 rounded-[40px] overflow-hidden shadow-2xl">
                                <CardContent className="space-y-8 pt-12 px-10 pb-10">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Identification Name</label>
                                        <Input
                                            placeholder="Who are you?"
                                            className="bg-white/5 border-white/10 h-16 rounded-2xl text-xl focus:border-primary/50 transition-all font-black px-6"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleNext}
                                        disabled={!formData.name}
                                        className="w-full h-16 bg-primary text-black hover:bg-primary/90 text-2xl font-black rounded-2xl transition-all shadow-[0_4px_30px_rgba(0,212,170,0.3)] hover:scale-[1.02] active:scale-95"
                                    >
                                        Proceed <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10 text-center"
                        >
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                                    Define your <span className="text-primary italic">Vibe</span>
                                </h1>
                                <p className="text-muted-foreground text-lg font-medium">We&apos;ll tune your workspace to your specific neural output.</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'creator', name: 'Creator', icon: Rocket },
                                    { id: 'startup', name: 'Startup', icon: Rocket },
                                    { id: 'agency', name: 'Agency', icon: Users },
                                    { id: 'student', name: 'Student', icon: GraduationCap },
                                    { id: 'freelancer', name: 'Freelancer', icon: Briefcase },
                                    { id: 'pro', name: 'Pro Individual', icon: Layout },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => {
                                            setFormData({ ...formData, type: type.id });
                                            handleNext();
                                        }}
                                        className={cn(
                                            "glass p-6 rounded-[32px] border transition-all text-center group relative overflow-hidden h-40 flex flex-col items-center justify-center",
                                            formData.type === type.id
                                                ? 'border-primary bg-primary/10 shadow-[0_0_40px_rgba(0,212,170,0.2)] scale-105 z-10'
                                                : 'border-white/5 hover:border-primary/50 grayscale hover:grayscale-0'
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-500",
                                            formData.type === type.id ? 'bg-primary text-black' : 'bg-white/5 text-white'
                                        )}>
                                            <type.icon className="w-6 h-6" />
                                        </div>
                                        <span className="font-black text-[10px] uppercase tracking-widest">{type.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-10 text-center"
                        >
                            <div className="space-y-4">
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                                    Name your <span className="text-primary italic">Space</span>
                                </h1>
                                <p className="text-muted-foreground text-lg font-medium">Every great mission starts with a base of operations.</p>
                            </div>
                            <Card className="glass border-white/10 p-2 rounded-[40px] overflow-hidden">
                                <CardContent className="space-y-8 pt-12 px-10 pb-10">
                                    <div className="space-y-3 text-left">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary ml-1">Workspace Designation</label>
                                        <Input
                                            placeholder="e.g. Project Orion"
                                            className="bg-white/5 border-white/10 h-16 rounded-2xl text-xl focus:border-primary/50 transition-all font-black px-6"
                                            value={formData.workspaceName}
                                            onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        onClick={handleNext}
                                        disabled={!formData.workspaceName || isSaving}
                                        className="w-full h-16 bg-primary text-black hover:bg-primary/90 text-2xl font-black rounded-2xl transition-all shadow-[0_4px_30px_rgba(0,212,170,0.3)] hover:scale-[1.02] active:scale-95"
                                    >
                                        {isSaving ? <Loader2 className="w-8 h-8 animate-spin mx-auto" /> : <>Launch Universe <ArrowRight className="ml-2 w-6 h-6" /></>}
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-12"
                        >
                            <div className="relative mx-auto w-40 h-40">
                                <div className="absolute inset-0 bg-primary blur-[60px] opacity-40 animate-pulse" />
                                <div className="relative w-40 h-40 rounded-[48px] bg-primary/20 flex items-center justify-center border-4 border-primary shadow-[0_0_60px_rgba(0,212,170,0.5)]">
                                    <CheckCircle2 className="w-20 h-20 text-primary" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h1 className="text-6xl md:text-7xl font-black tracking-tighter uppercase italic">
                                    Mission <span className="text-primary italic">Live</span>
                                </h1>
                                <p className="text-xl text-muted-foreground max-w-sm mx-auto font-medium">
                                    Welcome aboard, <span className="text-white font-black">{formData.name}</span>. Your workspace is synchronized.
                                </p>
                            </div>
                            <Button
                                onClick={handleNext}
                                className="w-full h-20 bg-primary text-black hover:bg-primary/90 text-3xl font-black rounded-[40px] transition-all shadow-[0_10px_50px_rgba(0,212,170,0.4)] hover:-translate-y-2 active:scale-95 uppercase tracking-tighter italic"
                            >
                                Enter Dashboard
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Floating Footer Logo */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-40 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Zap className="text-black w-6 h-6 fill-current" />
                </div>
                <span className="font-black text-xl tracking-tight uppercase italic underline decoration-primary/50 decoration-2 underline-offset-4">UniWork</span>
            </div>
        </div>
    );
}

