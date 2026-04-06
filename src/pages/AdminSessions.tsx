import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from "lucide-react";

interface Session {
  id: string;
  title: string | null;
  description: string | null;
  session_date: string;
  zoom_link: string | null;
  zoom_meeting_id: string | null;
  created_at: string;
}

export default function AdminSessions() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [zoomMeetingId, setZoomMeetingId] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_auth");
    if (saved === "true") {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated) fetchSessions();
  }, [authenticated]);

  const fetchSessions = async () => {
    const { data } = await supabase
      .from("storytelling_sessions")
      .select("*")
      .order("session_date", { ascending: true });
    if (data) setSessions(data);
  };

  const handleLogin = async () => {
    // Verify password by calling edge function with a GET-like check
    try {
      const res = await supabase.functions.invoke("admin-sessions", {
        method: "POST",
        body: { password, action: "verify" },
      });
      if (res.data?.error) {
        toast({ title: "Wrong password", variant: "destructive" });
        return;
      }
      if (res.data?.ok) {
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_pw", password);
        setAuthenticated(true);
      } else {
        toast({ title: "Unexpected response", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
  };

  const getPassword = () => sessionStorage.getItem("admin_pw") || password;

  const handleCreate = async () => {
    if (!sessionDate) {
      toast({ title: "Date is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const res = await supabase.functions.invoke("admin-sessions", {
      body: {
        password: getPassword(),
        action: "create",
        title: title || null,
        description: description || null,
        session_date: new Date(sessionDate).toISOString(),
        zoom_link: zoomLink || null,
        zoom_meeting_id: zoomMeetingId || null,
      },
    });
    setLoading(false);
    if (res.error || res.data?.error) {
      toast({ title: "Error creating session", description: res.error?.message || res.data?.error, variant: "destructive" });
      return;
    }
    toast({ title: "Session created!" });
    setTitle(""); setDescription(""); setSessionDate(""); setZoomLink(""); setZoomMeetingId("");
    fetchSessions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    const res = await supabase.functions.invoke("admin-sessions", {
      body: { password: getPassword(), action: "delete", id },
    });
    if (res.error) {
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
      <h1 className="text-2xl font-bold mb-6 text-foreground">Manage Storytelling Sessions</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Session</CardTitle>
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
              <Label htmlFor="zoom">Zoom Link</Label>
              <Input id="zoom" value={zoomLink} onChange={(e) => setZoomLink(e.target.value)} placeholder="https://zoom.us/j/..." />
            </div>
            <div>
              <Label htmlFor="mid">Zoom Meeting ID</Label>
              <Input id="mid" value={zoomMeetingId} onChange={(e) => setZoomMeetingId(e.target.value)} placeholder="123 456 7890" />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create Session"}
          </Button>
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
                  <TableHead>Zoom</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.title || "Untitled"}</TableCell>
                    <TableCell>{new Date(s.session_date).toLocaleString()}</TableCell>
                    <TableCell>{s.zoom_meeting_id || "—"}</TableCell>
                    <TableCell>
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
