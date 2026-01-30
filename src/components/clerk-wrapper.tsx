"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function ClerkWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                elements: {
                    formButtonPrimary: "bg-primary text-black hover:bg-primary/90 font-black italic tracking-tighter uppercase rounded-2xl h-12 shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all active:scale-95",
                    footerActionLink: "text-primary hover:text-primary/90 font-bold",
                    card: "glass border border-white/10 rounded-[40px] shadow-2xl overflow-hidden",
                    headerTitle: "text-3xl font-black italic tracking-tighter uppercase text-white",
                    headerSubtitle: "text-muted-foreground font-bold italic opacity-60",
                    formFieldLabel: "text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground ml-2",
                    formFieldInput: "bg-white/5 border-white/10 rounded-2xl h-12 px-6 font-bold text-white focus:border-primary/50",
                    identityPreviewText: "text-white font-black italic",
                    userButtonPopoverCard: "glass border border-white/10 rounded-[32px] p-2 shadow-2xl",
                },
            }}
        >
            {children}
        </ClerkProvider>
    );
}
