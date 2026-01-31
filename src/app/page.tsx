"use client";

import React from "react";
import { Play, CheckCircle, Calendar, LayoutDashboard, BarChart3, ArrowRight, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111621] text-slate-900 dark:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#111621]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#195de6] p-1.5 rounded-lg flex items-center justify-center">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight">UniWork</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-medium hover:text-[#195de6] transition-colors" href="#">Product</a>
            <a className="text-sm font-medium hover:text-[#195de6] transition-colors" href="#">Features</a>
            <a className="text-sm font-medium hover:text-[#195de6] transition-colors" href="#pricing">Pricing</a>
            <a className="text-sm font-medium hover:text-[#195de6] transition-colors" href="#">Enterprise</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block text-sm font-semibold hover:text-[#195de6]">Log in</Link>
            <Button asChild className="bg-[#195de6] hover:bg-[#195de6]/90 text-white px-5 py-2 rounded-lg text-sm font-bold">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[#195de6]/20 blur-[120px] rounded-full -z-10"></div>

        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#195de6]/10 border border-[#195de6]/20 text-[#195de6] text-xs font-bold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-[#195de6] animate-pulse"></span>
            v2.0 NOW LIVE — NEW COLLABORATIVE FEATURES
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            Everything your team needs.<br />
            <span className="text-[#195de6]">All in one workspace.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop jumping between tools. Connect your messages, documents, and tasks in a single high-performance platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-[#195de6] hover:bg-[#195de6]/90 text-white px-8 py-6 rounded-xl text-base font-bold shadow-lg shadow-[#195de6]/25">
              <Link href="/login">Start Your Free Trial</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-6 rounded-xl text-base font-bold border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Brands Section */}
      <section className="py-12 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-500 mb-8 uppercase">
            Powering 500+ Global Teams
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 opacity-50 grayscale">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-center">
                <div className="h-8 w-32 bg-slate-400 dark:bg-slate-600 rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1 - Messaging */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <div className="h-12 w-12 rounded-xl bg-[#195de6]/10 flex items-center justify-center text-[#195de6]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Integrated Messaging for <span className="text-[#195de6]">Deep Focus</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Cut the noise with threaded conversations that keep context where it belongs. UniWork brings your team together without the constant distraction of legacy chat tools.
            </p>
            <ul className="space-y-4">
              {[
                "Real-time presence and smart notifications",
                "Native file sharing with version history",
                "End-to-end encryption for all channels"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#195de6] shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[#195de6]/20 blur-3xl rounded-full scale-75"></div>
            <div className="relative bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="h-full flex">
                <div className="w-16 border-r border-slate-800 bg-slate-950 flex flex-col items-center py-4 gap-4">
                  <div className="w-8 h-8 rounded bg-[#195de6]"></div>
                  <div className="w-8 h-8 rounded bg-slate-800"></div>
                  <div className="w-8 h-8 rounded bg-slate-800"></div>
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="h-12 border-b border-slate-800 flex items-center px-4 justify-between">
                    <span className="font-bold text-sm text-white">#product-launch</span>
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-24 bg-slate-800 rounded"></div>
                        <div className="h-10 w-48 bg-slate-800/50 rounded-lg"></div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#195de6]/50"></div>
                      <div className="space-y-1">
                        <div className="h-3 w-16 bg-slate-800 rounded"></div>
                        <div className="h-16 w-64 bg-[#195de6]/10 rounded-lg border border-[#195de6]/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2 - Documents */}
      <section className="py-24 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-[#195de6]/10 blur-3xl rounded-full scale-75 translate-x-10"></div>
            <div className="relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden aspect-[4/3]">
              <div className="p-8 h-full">
                <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded"></div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded"></div>
                  <div className="h-3 w-4/5 bg-slate-100 dark:bg-slate-900 rounded"></div>
                </div>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-orange-500 ring-2 ring-white dark:ring-slate-950"></div>
                  <div className="h-3 w-32 bg-orange-500/20 rounded"></div>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-[#195de6] ring-2 ring-white dark:ring-slate-950"></div>
                  <div className="h-3 w-48 bg-[#195de6]/20 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <div className="h-12 w-12 rounded-xl bg-[#195de6]/10 flex items-center justify-center text-[#195de6]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
              Notes That Live <span className="text-[#195de6]">Where You Work</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Brainstorm, document, and execute in real-time. Our collaborative canvas supports markdown, embeds, and instant task conversion from any line of text.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <svg className="w-6 h-6 text-[#195de6] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h4 className="font-bold text-sm mb-1">Multi-player Editing</h4>
                <p className="text-xs text-slate-500">Edit together in real-time with zero lag.</p>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <svg className="w-6 h-6 text-[#195de6] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <h4 className="font-bold text-sm mb-1">Markdown Magic</h4>
                <p className="text-xs text-slate-500">Power-user shortcuts for fast writing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-white dark:bg-[#111621]" id="pricing">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              Scalable pricing for<br />
              <span className="text-[#195de6]">ambitious teams.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Choose a plan that works for your team's size and needs. Upgrade as you grow.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Basic Plan */}
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col hover:border-[#195de6]/30 transition-all bg-gradient-to-b from-white/5 to-transparent dark:from-slate-900/50">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">$0</span>
                  <span className="text-slate-500 text-sm">/mo</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Perfect for small teams getting started with collaboration.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Up to 10 team members
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Basic messaging & documentation
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  5GB secure storage
                </li>
              </ul>
              <Button variant="outline" className="w-full py-4 rounded-xl font-bold">Start for Free</Button>
            </div>

            {/* Advanced Plan */}
            <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col hover:border-[#195de6]/30 transition-all bg-gradient-to-b from-white/5 to-transparent dark:from-slate-900/50">
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">Advanced</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">$12</span>
                  <span className="text-slate-500 text-sm">/user/mo</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Enhanced productivity tools for growing organizations.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-sm font-semibold">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Everything in Basic
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Unlimited team members
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Advanced Kanban & Analytics
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  100GB secure storage
                </li>
              </ul>
              <Button className="w-full py-4 rounded-xl bg-slate-800 dark:bg-white text-white dark:text-black font-bold hover:opacity-90">
                Upgrade to Advanced
              </Button>
            </div>

            {/* Premium Plan */}
            <div className="relative p-8 rounded-3xl bg-slate-900 flex flex-col overflow-hidden ring-4 ring-[#195de6]/20">
              <div className="absolute top-4 right-4 bg-[#195de6] text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                Best Value
              </div>
              <div className="mb-8 relative z-10">
                <h3 className="text-xl font-bold mb-2 text-white">Premium</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black text-white">$29</span>
                  <span className="text-slate-400 text-sm">/user/mo</span>
                </div>
                <p className="text-sm text-slate-300">The ultimate workspace for security-conscious enterprises.</p>
              </div>
              <ul className="space-y-4 mb-10 flex-1 relative z-10">
                <li className="flex items-center gap-3 text-sm font-semibold text-white">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Everything in Advanced
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Single Sign-On (SSO) & SAML
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  24/7 Priority Concierge Support
                </li>
                <li className="flex items-center gap-3 text-sm text-white/90">
                  <CheckCircle className="w-5 h-5 text-[#195de6]" />
                  Unlimited storage & Data isolation
                </li>
              </ul>
              <Button className="w-full py-4 rounded-xl bg-[#195de6] text-white font-black shadow-xl shadow-[#195de6]/40 hover:scale-[1.02] transition-transform relative z-10">
                Go Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">And so much more...</h2>
            <p className="text-slate-500">Built for high-performance teams who demand more from their software.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#195de6]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-[#195de6]/10 transition-colors">
                <Calendar className="w-6 h-6 text-[#195de6]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Calendar</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Sync your team's availability and schedule meetings without leaving your chat threads.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#195de6]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-[#195de6]/10 transition-colors">
                <LayoutDashboard className="w-6 h-6 text-[#195de6]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Kanban Boards</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Visual project management with custom workflows, labels, and automated status updates.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-[#195de6]/50 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-[#195de6]/10 transition-colors">
                <BarChart3 className="w-6 h-6 text-[#195de6]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Analytics</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Gain insights into team velocity, bottleneck projects, and workload distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[2.5rem] bg-[#195de6] overflow-hidden p-12 md:p-24 text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to unify your workflow?</h2>
              <p className="text-white/80 text-lg mb-10 leading-relaxed">
                Join 500+ global teams already using UniWork to ship faster. No credit card required to start.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button className="w-full sm:w-auto bg-white text-[#195de6] hover:bg-slate-100 px-10 py-6 rounded-xl text-base font-black">
                  Get Started Free
                </Button>
                <Button variant="outline" className="w-full sm:w-auto bg-[#195de6]/20 text-white border-white/20 hover:bg-[#195de6]/30 px-10 py-6 rounded-xl text-base font-black">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#195de6] p-1.5 rounded-lg">
                  <Rocket className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">UniWork</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                The premium SaaS team-collaboration and productivity app designed for high-performance teams.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Messaging</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Documentation</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Tasks</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Integrations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#195de6] transition-colors" href="#">About</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Press</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Community</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Status</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-sm mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Privacy</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Terms</a></li>
                <li><a className="hover:text-[#195de6] transition-colors" href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">© 2024 UniWork Inc. All rights reserved.</p>
            <div className="flex gap-6 text-slate-500">
              <a href="#" className="hover:text-[#195de6]">Twitter</a>
              <a href="#" className="hover:text-[#195de6]">LinkedIn</a>
              <a href="#" className="hover:text-[#195de6]">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
