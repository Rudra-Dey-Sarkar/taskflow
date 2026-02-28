"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Loader2,
    Trash2,
    Users,
    ListTodo,
    CheckCircle2,
    Circle,
    Shield,
    Mail,
    Calendar,
} from "lucide-react";

interface User {
    id: string;
    user_type: "user" | "admin";
    name: string;
    email: string;
    created_at: string;
}

interface TaskWithUser {
    id: string;
    user_id: string;
    name: string;
    description: string;
    is_complete: boolean;
    created_at: string;
    user_name?: string;
    user_email?: string;
}

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [tasks, setTasks] = useState<TaskWithUser[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);
    const [isLoadingTasks, setIsLoadingTasks] = useState(true);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/v1/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch {
            toast.error("Failed to load users");
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    const fetchTasks = useCallback(async () => {
        try {
            const res = await fetch("/api/v1/tasks");
            if (res.ok) {
                const data = await res.json();
                setTasks(data.tasks);
            }
        } catch {
            toast.error("Failed to load tasks");
        } finally {
            setIsLoadingTasks(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, [fetchUsers, fetchTasks]);

    const handleDeleteUser = async (id: string, name: string) => {
        if (!confirm(`Delete user "${name}" and all their tasks? This cannot be undone.`)) return;
        setDeletingUserId(id);
        try {
            const res = await fetch(`/api/v1/users/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to delete user");
                return;
            }
            toast.success("User deleted successfully");
            fetchUsers();
            fetchTasks();
        } catch {
            toast.error("Failed to delete user");
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleDeleteTask = async (id: string) => {
        setDeletingTaskId(id);
        try {
            const res = await fetch(`/api/v1/tasks/${id}`, { method: "DELETE" });
            if (!res.ok) {
                toast.error("Failed to delete task");
                return;
            }
            toast.success("Task deleted");
            fetchTasks();
        } catch {
            toast.error("Failed to delete task");
        } finally {
            setDeletingTaskId(null);
        }
    };

    const handleToggleTask = async (task: TaskWithUser) => {
        try {
            const res = await fetch(`/api/v1/tasks/${task.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_complete: !task.is_complete }),
            });
            if (!res.ok) {
                toast.error("Failed to update task");
                return;
            }
            fetchTasks();
        } catch {
            toast.error("Failed to update task");
        }
    };

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.is_complete).length;
    const totalUsers = users.length;
    const adminCount = users.filter((u) => u.user_type === "admin").length;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-7 w-7 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Manage users and tasks across the platform
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Users className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{totalUsers}</p>
                                <p className="text-xs text-muted-foreground">Users</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <Shield className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-2xl font-bold">{adminCount}</p>
                                <p className="text-xs text-muted-foreground">Admins</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <ListTodo className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="text-2xl font-bold">{totalTasks}</p>
                                <p className="text-xs text-muted-foreground">Total Tasks</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-3 p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <div>
                                <p className="text-2xl font-bold">{completedTasks}</p>
                                <p className="text-xs text-muted-foreground">Completed</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="users" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="users" className="gap-1.5">
                            <Users className="h-4 w-4" /> Users
                        </TabsTrigger>
                        <TabsTrigger value="tasks" className="gap-1.5">
                            <ListTodo className="h-4 w-4" /> All Tasks
                        </TabsTrigger>
                    </TabsList>

                    {/* Users Tab */}
                    <TabsContent value="users">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">All Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingUsers ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : users.length === 0 ? (
                                    <p className="text-center py-12 text-muted-foreground">
                                        No users found
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {users.map((user) => (
                                            <div
                                                key={user.id}
                                                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{user.name}</p>
                                                            <Badge
                                                                variant={
                                                                    user.user_type === "admin"
                                                                        ? "default"
                                                                        : "secondary"
                                                                }
                                                            >
                                                                {user.user_type}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Mail className="h-3 w-3" />
                                                                {user.email}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {new Date(user.created_at).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {user.user_type !== "admin" && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteUser(user.id, user.name)}
                                                        disabled={deletingUserId === user.id}
                                                    >
                                                        {deletingUserId === user.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tasks Tab */}
                    <TabsContent value="tasks">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">All Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isLoadingTasks ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <p className="text-center py-12 text-muted-foreground">
                                        No tasks found
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3 flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleTask(task)}
                                                        className="mt-0.5"
                                                    >
                                                        {task.is_complete ? (
                                                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                        ) : (
                                                            <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                                        )}
                                                    </button>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p
                                                                className={`font-medium ${task.is_complete ? "line-through text-muted-foreground" : ""}`}
                                                            >
                                                                {task.name}
                                                            </p>
                                                            <Badge
                                                                variant={
                                                                    task.is_complete ? "success" : "warning"
                                                                }
                                                            >
                                                                {task.is_complete ? "Done" : "Active"}
                                                            </Badge>
                                                        </div>
                                                        {task.description && (
                                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                                                                {task.description}
                                                            </p>
                                                        )}
                                                        <p className="text-xs text-muted-foreground/60 mt-2">
                                                            By {task.user_name || "Unknown"} ({task.user_email}) •{" "}
                                                            {new Date(task.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:text-destructive ml-2"
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    disabled={deletingTaskId === task.id}
                                                >
                                                    {deletingTaskId === task.id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
