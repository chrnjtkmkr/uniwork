# UniWork | High-Performance Collaboration Platform

UniWork is a comprehensive, enterprise-grade productivity suite designed for modern teams. It centralizes task management, collaborative documentation, real-time communication, and AI-driven strategic insights into a single, high-fidelity workspace.

## 🚀 Professional Features

- **Universe Pulse (Dashboard)**: Real-time command center with bento-style metrics and critical path monitoring.
- **Neural Board (Task OS)**: Advanced Kanban and Stream views with granular assignment, priority mapping, and deadline tracking.
- **Liquid Notes**: Professional markdown-based documentation hub with real-time AI content expansion.
- **Team Nexus**: Administrative personnel management with role-based security (Owner to Viewer) and department clustering.
- **Communications Hub**: Structured multi-channel chat system with external node mirroring (WhatsApp/Telegram/Discord).
- **UniBot AI Assistant**: Strategic intelligence partner powered by GPT-4 for audit, sprint planning, and logical expansion.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescript.org/)
- **Database**: [Prisma](https://www.prisma.io/) (PostgreSQL/SQLite)
- **Authentication**: [Clerk](https://clerk.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Deployment Readiness

To deploy UniWork to a production environment (such as Vercel):

1. **Environment Configuration**: 
   - Copy `.env.example` to `.env`.
   - Configure your **Clerk API Keys**.
   - Set your **OpenAI API Key** for UniBot functionality.
   - Configure a **PostgreSQL** database (e.g., Neon, Supabase) and update `prisma/schema.prisma` provider to `postgresql`.

2. **Database Initialization**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Production Build**:
   ```bash
   npm run build
   ```

## 🎨 Design Philosophy

UniWork follows a **"Clean Tech / Professional Dark"** aesthetic. It prioritizes:
- **Clarity**: High-contrast Inter typography and logical information density.
- **Efficiency**: 12px-16px structured radii and logical component hierarchy.
- **Responsiveness**: Fully fluid layouts optimized for desktop and mobile nodes.

---
*Created with focus on high-performance team synchronization and strategic logic.*
