import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Lock,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                TaskFlow
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="gap-1">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground mb-6 bg-muted/50">
              <Lock className="h-3.5 w-3.5 mr-2" />
              Secure & Role-Based Access
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Task Management,
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Simplified & Secure
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              A production-ready task management platform with JWT
              authentication, role-based access control, and a clean REST API.
              Built for teams that value security and scalability.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/register">
                <Button size="lg" className="gap-2 px-8">
                  Start Managing Tasks <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Built for Security & Scale
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade features with a clean, modern architecture
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                JWT Authentication
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Secure HTTP-only cookie-based JWT tokens with bcrypt password
                hashing. No token in localStorage, ever.
              </p>
            </div>
            <div className="group rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Role-Based Access
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Two-tier access control with user and admin roles. Middleware
                enforces permissions at every route.
              </p>
            </div>
            <div className="group rounded-xl border bg-card p-8 transition-all hover:shadow-lg hover:border-primary/20">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Full CRUD API
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                RESTful endpoints for tasks with Zod validation, API
                versioning, and proper HTTP status codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">TaskFlow</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Built with Next.js, TypeScript & Neon PostgreSQL
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
