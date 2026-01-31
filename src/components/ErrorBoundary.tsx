"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 rounded-[32px] bg-red-500/10 flex items-center justify-center text-red-500 mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <AlertTriangle className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase mb-4">
                        Neural Link <span className="text-red-500">Interrupted</span>
                    </h1>
                    <p className="text-slate-400 max-w-md mx-auto mb-10 text-sm font-medium leading-relaxed">
                        The operational sequence encountered a non-critical fragmentation. System integrity is being maintained, but this node requires a manual reset.
                    </p>
                    <Button
                        className="bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all active:scale-95"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw className="w-4 h-4" />
                        Re-Initialize Protocol
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
