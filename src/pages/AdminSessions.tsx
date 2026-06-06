import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil } from "lucide-react";

interface Session {
  id: string;
  title: string | null;
  description: string | null;
  session_date: string;
  zoom_link: string | null;
  zoom_meeting_id: string | null;
  status: string;
  created_at: string;
}

import { verifyAdminPassword, isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";

export default function AdminSessions() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated) fetchSessions();
  }, [authenticated]);

  const fetchSessions = async () => {
    const { data, error } = await supabase
      .from("storytelling_sessions")
      .select("*")
      .order("session_date", { ascending: true });
    if (!error && data) setSessions(data as Session[]);
  };

  const handleLogin = async () => {
    const ok = await verifyAdminPassword(password);
    if (ok) {
      setAdminAuthenticated();
      setAuthenticated(true);
      setPassword("");
    } else {
      toast({ title: "Wrong password", variant: "destructive" });
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setSessionDate("");
    setZoomLink("");
    setZoomMeetingId("");
    setStatus("draft");
    setEditingId(null);
  };

  const handleEdit = (s: Session) => {
    setEditingId(s.id);
    setTitle(s.title || "");
    setDescription(s.description || "");
    const d = new Date(s.session_date);
    const pad = (n: number) => n.toString().padStart(2, "0");
    setSessionDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    setZoomLink(s.zoom_link || "");
    setZoomMeetingId(s.zoom_meeting_id || "");
    setStatus((s.status as "draft" | "published") || "draft");
  };

  const handleCreateOrUpdate = async () => {
    if (!sessionDate) {
      toast({ title: "Date is required", variant: "destructive" });
      return;
    }
    setLoading(true);

    const cleanMeetingId = zoomMeetingId ? zoomMeetingId.replace(/\D/g, "") : null;
    const payload = {
      title: title || null,
      description: description || null,
      session_date: new Date(sessionDate).toISOString(),
      zoom_link: zoomLink || null,
      zoom_meeting_id: cleanMeetingId,
      status: status === "published" ? "published" : "draft",
    };

    if (editingId) {
      const { error } = await supabase
        .from("storytelling_sessions")
        .update(payload)
        .eq("id", editingId);
      setLoading(false);
      if (error) {
        toast({ title: "Error updating session", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Session updated!" });
    } else {
      const { error } = await supabase
        .from("storytelling_sessions")
        .insert(payload);
      setLoading(false);
      if (error) {
        toast({ title: "Error creating session", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Session created!" });
    }

    clearForm();
    fetchSessions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    const { error } = await supabase
      .from("storytelling_sessions")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Error deleting", variant: "destructive" });
      return;
    }
    toast({ title: "Session deleted" });
    fetchSessions();
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
      <nav className="text-xs text-muted-foreground mb-4">
        <Link to="/rokofsky-admin" className="hover:text-foreground underline-offset-2 hover:underline">Admin</Link>
        <span className="mx-2">/</span>
        <span>Storytelling Sessions</span>
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Storytelling Sessions</h1>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Home
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Session" : "Add New Session"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Storytelling Session" />
            </div>
            <div>
              <Label htmlFor="date">Date & Time</Label>
              <Input id="date" type="datetime-local" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="desc">Description</Label>
            <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="zoom">Zoom Join Link</Label>
              <Input id="zoom" value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." />
              <p className="text-xs text-muted-foreground mt-1">Paste the Zoom Registration link here</p>
            </div>
            <div>
              <Label htmlFor="mid">Zoom Meeting ID (numeric)</Label>
              <Input id="mid" value={zoomMeetingId} onChange={(e) => setZoomMeetingId(e.target.value)} placeholder="84146763709" />
              <p className="text-xs text-muted-foreground mt-1">Digits only — used for API registration</p>
            </div>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as "draft" | "published")}
            >
              <option value="draft">Draft (hidden from public)</option>
              <option value="published">Published (visible on /storytelling-sessions)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateOrUpdate} disabled={loading}>
              {loading ? (editingId ? "Updating..." : "Creating...") : (editingId ? "Update Session" : "Create Session")}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={clearForm}>Cancel</Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground">No sessions yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Zoom</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.title || "Untitled"}</TableCell>
                    <TableCell>{new Date(s.session_date).toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s.status === "published" ? "bg-green-500/20 text-green-700 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                        {s.status || "draft"}
                      </span>
                    </TableCell>
                    <TableCell>{s.zoom_meeting_id || "—"}</TableCell>
                    <TableCell className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
