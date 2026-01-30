"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, Shield, Rocket, Globe, Users, MessageSquare, Files, CheckCircle2, ArrowRight, Play, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-black selection:bg-primary/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] glass border-b border-white/5 px-8 py-5 flex items-center justify-between backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-transform group-hover:rotate-12">
            <Zap className="text-black w-6 h-6 fill-current" />
          </div>
          <span className="font-black text-2xl tracking-tighter uppercase italic text-white underline decoration-primary/50 decoration-2 underline-offset-4">UniWork</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-all hover:scale-105">Protocols</Link>
          <Link href="#integrations" className="hover:text-primary transition-all hover:scale-105">Nodes</Link>
          <Link href="#pricing" className="hover:text-primary transition-all hover:scale-105">Energy</Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-colors hidden sm:block">Authorize</Link>
          <Button asChild className="bg-primary text-black hover:bg-primary/90 rounded-2xl px-8 h-12 font-black italic tracking-tighter text-base shadow-[0_0_25px_rgba(0,212,170,0.4)] transition-all active:scale-95">
            <Link href="/login">Launch Universe</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Extreme Background Glows */}
        <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-purple-500/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-8 border-primary/30 text-primary bg-primary/5 px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_0_15px_rgba(0,212,170,0.1)]">
              <Sparkles className="w-3.5 h-3.5 mr-2 animate-pulse" /> Neural Engine 2.0 is Live
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-9xl font-black tracking-tighter mb-10 text-white max-w-5xl mx-auto leading-[0.9] uppercase italic"
          >
            One Space For <br />
            <span className="text-primary italic underline decoration-white/20 decoration-8 underline-offset-10">Everything</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
          >
            UniWork unifies tasks, real-time docs, massive file storage, and encrypted team chat into one <span className="text-white font-bold italic">hyper-optimized neural workstation</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90 h-16 px-12 rounded-[24px] text-xl font-black italic tracking-tighter w-full sm:w-auto shadow-[0_10px_40px_rgba(0,212,170,0.4)] hover:-translate-y-1 transition-all">
              <Link href="/login">Create Free Workspace</Link>
            </Button>
            <Button size="lg" variant="outline" className="h-16 px-12 rounded-[24px] text-xl font-black italic tracking-tighter w-full sm:w-auto border-white/10 glass hover:bg-white/5 transition-all">
              <Play className="mr-3 w-6 h-6 fill-primary text-primary" /> Watch Demo
            </Button>
          </motion.div>

          {/* Real Live Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-24 relative mx-auto max-w-6xl group"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/40 to-blue-500/40 rounded-[48px] blur-[80px] opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass rounded-[44px] border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-10" />
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3"
                alt="UniWork Dashboard Preview"
                className="w-full h-auto opacity-80 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-8 relative bg-primary/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 px-4">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">The Neural <br /><span className="text-primary italic">Protocols</span></h2>
              <p className="text-muted-foreground font-medium text-lg max-w-md">Engineered for the highest velocity teams and individuals.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-32 bg-primary/20" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Core Modules</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Task OS",
                desc: "Kanban, lists, and neural timelines with autonomous task distribution and sync.",
                icon: CheckCircle2,
                color: "bg-primary/10 text-primary",
                features: ["Neural Timelines", "Cosmic Velocity", "Auto-Sync"]
              },
              {
                title: "Liquid Docs",
                desc: "High-fidelity markdown documents with AI expansion logic and version control.",
                icon: Files,
                color: "bg-blue-500/10 text-blue-400",
                features: ["AI Assist", "Real-time Edge", "Logic Flow"]
              },
              {
                title: "Secure Hub",
                desc: "Infinite cloud drive nodes for high-res assets, encrypted and lightning fast.",
                icon: Globe,
                color: "bg-purple-500/10 text-purple-400",
                features: ["Multi-Drive", "Neural Index", "E2E Privacy"]
              }
            ].map((f, i) => (
              <div key={i} className="glass p-10 rounded-[48px] border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-all" />
                <div className={cn("mb-8 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl", f.color)}>
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black italic tracking-tighter mb-4 text-white uppercase">{f.title}</h3>
                <p className="text-muted-foreground mb-8 font-medium leading-relaxed">{f.desc}</p>
                <div className="space-y-3">
                  {f.features.map(feat => (
                    <div key={feat} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {feat}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-32 px-8 border-t border-white/5 relative bg-black">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] text-white">Scale your <br /><span className="text-primary italic">Productivity</span></h2>
            <p className="text-muted-foreground font-medium text-xl">Join the elite few mastering the neural frontier of work.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 w-full md:w-auto">
            <Button asChild size="lg" className="bg-primary text-black hover:bg-primary/90 rounded-[28px] px-16 h-20 font-black italic tracking-tighter text-2xl shadow-[0_10px_40px_rgba(0,212,170,0.4)] transition-all active:scale-95">
              <Link href="/login">Launch Now</Link>
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
          <p>© 2026 UniWork Protocol. Unauthorized Access is Monitored.</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-all">Twitter</Link>
            <Link href="#" className="hover:text-primary transition-all">LinkedIn</Link>
            <Link href="#" className="hover:text-primary transition-all">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
