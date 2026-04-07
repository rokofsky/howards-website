import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

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
        toast({ title: "Wrong password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
  };

  const getPassword = () => sessionStorage.getItem("admin_pw") || password;

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (w: Webinar) => {
    setEditingId(w.id);
    setTitle(w.title);
    setDescription(w.description);
  };

  const handleCreateOrUpdate = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setLoading(true);

    const action = editingId ? "update" : "create";
    const res = await supabase.functions.invoke("admin-webinars", {
      body: {
        password: getPassword(),
        action,
        ...(editingId ? { id: editingId } : {}),
        title,
        description,
      },
    });

    setLoading(false);
    if (res.error || res.data?.error) {
      toast({ title: `Error ${action === "update" ? "updating" : "creating"} webinar`, description: res.error?.message || res.data?.error, variant: "destructive" });
      return;
    }
    toast({ title: `Webinar ${action === "update" ? "updated" : "created"}!` });
    clearForm();
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
          <CardTitle>{editingId ? "Edit Webinar" : "Add New Webinar"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Webinar title" />
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={3} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateOrUpdate} disabled={loading}>
              {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Webinar" : "Add Webinar")}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={clearForm}>Cancel</Button>
            )}
          </div>
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
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(w)}>
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
    </div>
  );
}
