import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil } from "lucide-react";

interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  created_at: string;
}

export default function AdminWebinars() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();

  // Add form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Edit modal state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved === "true") setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) fetchWebinars();
  }, [authenticated]);

  const fetchWebinars = async () => {
    const { data } = await supabase
      .from("webinars")
      .select("*")
      .order("title", { ascending: true });
    if (data) setWebinars(data as Webinar[]);
  };

  const handleLogin = async () => {
    try {
      const res = await supabase.functions.invoke("admin-webinars", {
        method: "POST",
        body: { password, action: "verify" },
      });
      if (res.data?.ok) {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_pw", password);
        setAuthenticated(true);
      } else {
        const next = loginAttempts + 1;
        setLoginAttempts(next);
        if (next >= 2) {
          navigate("/");
        } else {
          toast({ title: "Wrong password", variant: "destructive" });
        }
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
  };

  const getPassword = () => sessionStorage.getItem("admin_pw") || password;

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await supabase.functions.invoke("admin-webinars", {
      body: { password: getPassword(), action: "create", title, description },
    });
    setLoading(false);
    if (res.error || res.data?.error) {
      toast({ title: "Error creating webinar", description: res.error?.message || res.data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Webinar created!" });
    setTitle("");
    setDescription("");
    fetchWebinars();
  };

  const handleEditOpen = (w: Webinar) => {
    setEditId(w.id);
    setEditTitle(w.title);
    setEditDescription(w.description || "");
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editId || !editTitle.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setEditLoading(true);
    const res = await supabase.functions.invoke("admin-webinars", {
      body: {
        password: getPassword(),
        action: "update",
        id: editId,
        title: editTitle,
        description: editDescription,
      },
    });
    setEditLoading(false);
    if (res.error || res.data?.error) {
      toast({ title: "Error updating webinar", description: res.error?.message || res.data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Webinar updated!" });
    setEditDialogOpen(false);
    fetchWebinars();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this webinar?")) return;
    const res = await supabase.functions.invoke("admin-webinars", {
      body: { password: getPassword(), action: "delete", id },
    });
    if (res.error) {
      toast({ title: "Error deleting", variant: "destructive" });
      return;
    }
    toast({ title: "Webinar deleted" });
    fetchWebinars();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">Enter</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Manage Webinars</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Webinar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Webinar title" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (shown smaller on the card)" rows={3} />
          </div>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Add Webinar"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Webinars ({webinars.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {webinars.length === 0 ? (
            <p className="text-muted-foreground">No webinars yet.</p>
          ) : (
            <div className="space-y-3">
              {webinars.map((w) => (
                <div key={w.id} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{w.title}</p>
                    {w.description && <p className="text-sm text-muted-foreground mt-1">{w.description}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => handleEditOpen(w)}>
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(w.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Webinar Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Webinar</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input id="edit-title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <Textarea id="edit-desc" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Short description (shown smaller on the card)" rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
