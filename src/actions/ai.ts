"use server";

import { prisma } from "@/lib/prisma";

/**
 * Professional AI Action Wrapper
 * designed to be deploy-ready.
 * Requires OPENAI_API_KEY to be set in production.
 */
export async function generateAIResponse(prompt: string, context?: string) {
    const apiKey = process.env.OPENAI_API_KEY;

    // Simulate high-quality AI response for dev/demo if no API key
    if (!apiKey || apiKey === "sk-placeholder") {
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (prompt.toLowerCase().includes("sprint") || prompt.toLowerCase().includes("project")) {
            return {
                success: true,
                message: `Based on your project parameters, I recommend a 2-week agile sprice focus on "Core Optimization". 
                \n\n**Strategic Nodes:**
                \n1. Finalize Auth flow (Security L1)
                \n2. Optimize Prisma relational queries
                \n3. Deploy high-fidelity UI patches
                \n\nShall I initialize these as tasks?`
            };
        }

        return {
            success: true,
            message: `Synchronization protocol complete. I've analyzed your request: "${prompt}". 
            \n\nCurrent system status is optimal. How can I assist with your workspace objectives today?`
        };
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4-turbo-preview",
                messages: [
                    { role: "system", content: "You are UniBot, the professional AI assistant for the UniWork platform. Help users with project management, team synchronization, and documentation. Maintain a clean, professional, and slightly futuristic tone." },
                    { role: "user", content: context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        return { success: true, message: data.choices[0].message.content };
    } catch (error) {
        console.error("AI Error:", error);
        return { success: false, error: "AI node communication failed." };
    }
}
