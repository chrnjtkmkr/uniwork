"use client";

import React, { useState, useEffect } from "react";
import {
    User as UserIcon,
    Shield,
    Settings as SettingsIcon,
    History,
    Bell,
    Fingerprint,
    Laptop,
    ChevronDown,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMockUser, updateUserProfile } from "@/actions/workspaces";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { toast } from "sonner";

type SettingsTab = "identity" | "security" | "preferences" | "activity";

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<SettingsTab>("identity");

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        timezone: "UTC -05:00 Eastern Time (ET)",
        position: "",
        bio: ""
    });

    useEffect(() => {
        async function init() {
            const me = await getMockUser();
            if (me) {
                setUser(me);
                setFormData({
                    name: me.name || "",
                    email: me.email || "",
                    timezone: "UTC -05:00 Eastern Time (ET)",
                    position: me.position || "",
                    bio: me.bio || ""
                });
            }
            setLoading(false);
        }
        init();
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const result = await updateUserProfile(user.id, {
                name: formData.name,
                email: formData.email,
                position: formData.position,
                bio: formData.bio
            });

            if (result.success && result.user) {
                setUser(result.user);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                timezone: "UTC -05:00 Eastern Time (ET)",
                position: user.position || "",
                bio: user.bio || ""
            });
            toast.info("Changes discarded");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
        );
    }

    const tabs = [
        { id: "identity" as SettingsTab, label: "Identity", icon: UserIcon },
        { id: "security" as SettingsTab, label: "Security", icon: Shield },
        { id: "preferences" as SettingsTab, label: "Preferences", icon: SettingsIcon },
        { id: "activity" as SettingsTab, label: "Activity", icon: History },
    ];

    return (
        <div className="flex h-screen bg-black">
            {/* Profile Sidebar */}
            <aside className="w-64 border-r border-zinc-800 flex flex-col bg-black">
                <div className="p-6">
                    {/* User Profile */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="relative mb-4">
                            <div className="size-20 rounded-full border border-zinc-700 p-0.5">
                                <Avatar className="w-full h-full rounded-full">
                                    <AvatarImage src={user?.avatar || ""} />
                                    <AvatarFallback className="bg-zinc-800 text-white font-semibold text-xl">
                                        {formData.name?.[0]?.toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute bottom-1 right-1 size-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{formData.name || "User"}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{formData.position || "Team Member"}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                                        isActive
                                            ? "bg-primary/10 text-white border-r-2 border-primary"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                                    )}
                                >
                                    <Icon className="w-[18px] h-[18px]" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Status Footer */}
                <div className="mt-auto p-6 border-t border-zinc-900">
                    <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <span className="size-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                            Status: Synced
                        </span>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black p-10">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Profile Settings</h1>
                            <p className="text-sm text-zinc-500 mt-1">
                                Manage your digital identity and security parameters.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="ghost"
                                onClick={handleDiscard}
                                disabled={saving}
                                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                            >
                                Discard
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-all"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Commit Updates"
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Identity Tab */}
                    {activeTab === "identity" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Personal Information */}
                            <section className="bg-[#18181b] border border-zinc-800 rounded-xl p-8 space-y-8">
                                <div>
                                    <h2 className="text-base font-semibold text-white mb-1">
                                        Personal Information
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        Update your account details and public profile info.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                    {/* Full Name */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            Full Name
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange("name", e.target.value)}
                                            className="bg-transparent border-zinc-800 h-10 px-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Primary Email */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            Primary Email
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className="bg-transparent border-zinc-800 h-10 px-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Timezone */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            Current Timezone
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={formData.timezone}
                                                onChange={(e) => handleInputChange("timezone", e.target.value)}
                                                className="w-full bg-transparent border border-zinc-800 h-10 px-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary rounded-md appearance-none"
                                            >
                                                <option className="bg-zinc-900">UTC -05:00 Eastern Time (ET)</option>
                                                <option className="bg-zinc-900">UTC +00:00 London (GMT)</option>
                                                <option className="bg-zinc-900">UTC +01:00 Paris (CET)</option>
                                                <option className="bg-zinc-900">UTC +05:30 India (IST)</option>
                                                <option className="bg-zinc-900">UTC +08:00 Singapore (SGT)</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Workspace Role */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            Workspace Position
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.position}
                                            onChange={(e) => handleInputChange("position", e.target.value)}
                                            placeholder="e.g., Product Designer"
                                            className="bg-transparent border-zinc-800 h-10 px-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                        />
                                    </div>

                                    {/* Professional Bio */}
                                    <div className="col-span-2 flex flex-col gap-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                                            Professional Bio
                                        </label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => handleInputChange("bio", e.target.value)}
                                            className="bg-transparent border border-zinc-800 rounded-md min-h-[100px] p-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === "security" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <section className="bg-[#18181b] border border-zinc-800 rounded-xl p-8 space-y-6">
                                <div>
                                    <h2 className="text-base font-semibold text-white mb-1">
                                        Security & Access
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        Manage your password, 2FA and active sessions.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {/* Two-Factor Authentication */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                                                <Fingerprint className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Two-Factor Authentication
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    Biometric sync is currently active
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            onClick={() => toast.info("2FA configuration coming soon")}
                                            className="px-3 py-1.5 border-zinc-700 text-xs font-semibold text-white hover:bg-zinc-800"
                                        >
                                            Configure
                                        </Button>
                                    </div>

                                    {/* Current Session */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                                                <Laptop className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Current Session
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    San Francisco, USA • 192.168.1.1
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            onClick={() => toast.warning("Session will be terminated")}
                                            className="px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10"
                                        >
                                            Terminate
                                        </Button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === "preferences" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <section className="bg-[#18181b] border border-zinc-800 rounded-xl p-8">
                                <div className="mb-6">
                                    <h2 className="text-base font-semibold text-white mb-1">
                                        Application Preferences
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        Customize your workspace settings and notifications.
                                    </p>
                                </div>

                                {/* Notification Settings */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-zinc-900/30 border border-zinc-800">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 bg-zinc-800 rounded flex items-center justify-center text-zinc-400">
                                                <Bell className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">
                                                    Email Notifications
                                                </p>
                                                <p className="text-xs text-zinc-500">
                                                    Receive updates via email
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toast.info("Notification preferences updated")}
                                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors"
                                        >
                                            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <section className="bg-[#18181b] border border-zinc-800 rounded-xl p-8">
                                <div className="mb-6">
                                    <h2 className="text-base font-semibold text-white mb-1">
                                        Recent Activity
                                    </h2>
                                    <p className="text-xs text-zinc-500">
                                        View your recent actions and account history.
                                    </p>
                                </div>

                                {/* Activity Log */}
                                <div className="space-y-3">
                                    {[
                                        { action: "Profile updated", time: "2 minutes ago" },
                                        { action: "Logged in from new device", time: "1 hour ago" },
                                        { action: "Changed password", time: "2 days ago" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/30 border border-zinc-800">
                                            <span className="text-sm text-white">{item.action}</span>
                                            <span className="text-xs text-zinc-500">{item.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center py-6 border-t border-zinc-900">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 bg-blue-500/50 rounded-full"></span>
                                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                    UniWork OS v2.4.0
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="size-1.5 bg-green-500/50 rounded-full"></span>
                                <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                                    Network Secure
                                </span>
                            </div>
                        </div>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                            © 2024 UniWork Systems Inc.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
