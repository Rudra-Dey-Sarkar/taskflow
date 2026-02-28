"use client";

import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    ListTodo,
    CheckCircle2,
    Circle,
    ClipboardList,
} from "lucide-react";

interface Task {
    id: string;
    user_id: string;
    name: string;
    description: string;
    is_complete: boolean;
    created_at: string;
}

export default function DashboardPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [newTask, setNewTask] = useState({ name: "", description: "" });
    const [editData, setEditData] = useState({ name: "", description: "" });
    const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const res = await fetch("/api/v1/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newTask),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to create task");
                return;
            }
            toast.success("Task created!");
            setNewTask({ name: "", description: "" });
            setCreateOpen(false);
            fetchTasks();
        } catch {
            toast.error("Failed to create task");
        } finally {
            setIsCreating(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTask) return;
        setIsEditing(true);
        try {
            const res = await fetch(`/api/v1/tasks/${editingTask.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to update task");
                return;
            }
            toast.success("Task updated!");
            setEditOpen(false);
            setEditingTask(null);
            fetchTasks();
        } catch {
            toast.error("Failed to update task");
        } finally {
            setIsEditing(false);
        }
    };

    const handleToggle = async (task: Task) => {
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

    const handleDelete = async (id: string) => {
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
        }
    };

    const openEdit = (task: Task) => {
        setEditingTask(task);
        setEditData({ name: task.name, description: task.description });
        setEditOpen(true);
    };

    const filteredTasks = tasks.filter((t) => {
        if (filter === "active") return !t.is_complete;
        if (filter === "completed") return t.is_complete;
        return true;
    });

    const completedCount = tasks.filter((t) => t.is_complete).length;
    const activeCount = tasks.length - completedCount;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage and track your tasks
                        </p>
                    </div>
                    <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" /> New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                                <DialogDescription>
                                    Add a new task to your list
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreate}>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="task-name">Task Name</Label>
                                        <Input
                                            id="task-name"
                                            placeholder="Enter task name"
                                            required
                                            value={newTask.name}
                                            onChange={(e) =>
                                                setNewTask((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="task-desc">Description</Label>
                                        <Textarea
                                            id="task-desc"
                                            placeholder="Enter task description (optional)"
                                            value={newTask.description}
                                            onChange={(e) =>
                                                setNewTask((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={isCreating}>
                                        {isCreating ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Task"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <Card
                        className={`cursor-pointer transition-all ${filter === "all" ? "border-primary" : "hover:border-primary/50"}`}
                        onClick={() => setFilter("all")}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <ListTodo className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className="text-2xl font-bold">{tasks.length}</p>
                                <p className="text-xs text-muted-foreground">Total</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer transition-all ${filter === "active" ? "border-primary" : "hover:border-primary/50"}`}
                        onClick={() => setFilter("active")}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <Circle className="h-5 w-5 text-amber-500" />
                            <div>
                                <p className="text-2xl font-bold">{activeCount}</p>
                                <p className="text-xs text-muted-foreground">Active</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer transition-all ${filter === "completed" ? "border-primary" : "hover:border-primary/50"}`}
                        onClick={() => setFilter("completed")}
                    >
                        <CardContent className="flex items-center gap-3 p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <div>
                                <p className="text-2xl font-bold">{completedCount}</p>
                                <p className="text-xs text-muted-foreground">Done</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Task List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <ClipboardList className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <p className="text-lg font-medium text-muted-foreground">
                                {tasks.length === 0
                                    ? "No tasks yet"
                                    : "No tasks match this filter"}
                            </p>
                            <p className="text-sm text-muted-foreground/70 mt-1">
                                {tasks.length === 0
                                    ? 'Click "New Task" to get started'
                                    : "Try a different filter"}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {filteredTasks.map((task) => (
                            <Card
                                key={task.id}
                                className={`group transition-all hover:shadow-md ${task.is_complete ? "opacity-75" : ""}`}
                            >
                                <CardContent className="flex items-start gap-4 p-4">
                                    <Checkbox
                                        checked={task.is_complete}
                                        onCheckedChange={() => handleToggle(task)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p
                                                className={`font-medium ${task.is_complete ? "line-through text-muted-foreground" : ""}`}
                                            >
                                                {task.name}
                                            </p>
                                            <Badge
                                                variant={task.is_complete ? "success" : "warning"}
                                            >
                                                {task.is_complete ? "Done" : "Active"}
                                            </Badge>
                                        </div>
                                        {task.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground/60 mt-2">
                                            {new Date(task.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(task)}
                                            className="h-8 w-8"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(task.id)}
                                            className="h-8 w-8 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Edit Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Task</DialogTitle>
                            <DialogDescription>Update your task details</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleEdit}>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-name">Task Name</Label>
                                    <Input
                                        id="edit-name"
                                        required
                                        value={editData.name}
                                        onChange={(e) =>
                                            setEditData((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-desc">Description</Label>
                                    <Textarea
                                        id="edit-desc"
                                        value={editData.description}
                                        onChange={(e) =>
                                            setEditData((prev) => ({
                                                ...prev,
                                                description: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isEditing}>
                                    {isEditing ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
