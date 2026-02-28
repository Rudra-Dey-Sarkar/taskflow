"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap, LogOut, LayoutDashboard, Shield, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

interface User {
    id: string;
    name: string;
    email: string;
    user_type: "user" | "admin";
}

export function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        fetch("/api/v1/auth/me")
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => data && setUser(data.user))
            .catch(() => { });
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await fetch("/api/v1/auth/logout", { method: "POST" });
            toast.success("Logged out successfully");
            router.push("/auth/login");
            router.refresh();
        } catch {
            toast.error("Failed to logout");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Zap className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">TaskFlow</span>
                    </Link>


                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden sm:flex items-center gap-2 ml-4">
                                {user.user_type === "admin" ? (
                                    <div className="flex items-center gap-2">
                                        <Link href="/admin">
                                            <Button variant="ghost" size="sm" className="gap-1.5">
                                                <Shield className="h-4 w-4" />
                                                Admin Panel
                                            </Button>
                                        </Link>
                                        <Link href="/dashboard">
                                            <Button variant="ghost" size="sm" className="gap-1.5">
                                                <LayoutDashboard className="h-4 w-4" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <Link href="/dashboard">
                                        <Button variant="ghost" size="sm" className="gap-1.5">
                                            <LayoutDashboard className="h-4 w-4" />
                                            Dashboard
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                        <div className="hidden sm:flex w-[1px] h-[24px] bg-gray-200" />
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            {user && (
                                <>
                                    <div className="hidden sm:flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">
                                            {user.name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        className="gap-1.5"
                                    >
                                        {isLoggingOut ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <LogOut className="h-4 w-4" />
                                        )}
                                        <span className="hidden sm:inline">Logout</span>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
