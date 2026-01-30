"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function ClerkWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark,
                elements: {
                    formButtonPrimary: "bg-primary text-black hover:bg-primary/90",
                    footerActionLink: "text-primary hover:text-primary/90",
                    card: "glass border border-white/10 rounded-[32px]",
                },
            }}
        >
            {children}
        </ClerkProvider>
    );
}
