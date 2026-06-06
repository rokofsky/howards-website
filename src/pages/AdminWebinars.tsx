import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { verifyAdminPassword, getAdminToken, isAdminAuthenticated, setAdminAuthenticated } from "@/lib/adminAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  details: string;
  created_at: string;
  sort_order: number;
}

function SortableWebinarRow({
  webinar,
  onEdit,
  onDelete,
}: {
  webinar: Webinar;
  onEdit: (w: Webinar) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: webinar.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="rounded-lg border border-border bg-card p-5 flex flex-col justify-between"
    >
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-lg">{webinar.title}</h3>
        {webinar.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{webinar.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(webinar)}>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(webinar.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminWebinars() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (authenticated) fetchWebinars();
  }, [authenticated]);

  const fetchWebinars = async () => {
    const { data } = await supabase.from("webinars").select("*").order("sort_order", { ascending: true });
    if (data) setWebinars(data as unknown as Webinar[]);
  };

  const handleLogin = async () => {
    const ok = await verifyAdminPassword(password);
    if (ok) {
      setAdminAuthenticated();
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
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now();
    const maxOrder = webinars.length > 0 ? Math.max(...webinars.map((w) => w.sort_order)) + 1 : 0;
    const { error } = await supabase
      .from("webinars")
      .insert({ title, description, details, slug, sort_order: maxOrder } as never);
    setLoading(false);
    if (error) {
      toast({ title: "Error creating webinar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Webinar created!" });
    setTitle("");
    setDescription("");
    setDetails("");
    fetchWebinars();
  };

  const handleEditOpen = (w: Webinar) => {
    setEditId(w.id);
    setEditTitle(w.title);
    setEditDescription(w.description || "");
    setEditDetails(w.details || "");
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (!editId || !editTitle.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setEditLoading(true);
    const { error } = await supabase
      .from("webinars")
      .update({ title: editTitle, description: editDescription, details: editDetails } as never)
      .eq("id", editId);
    setEditLoading(false);
    if (error) {
      toast({ title: "Error updating", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Webinar updated!" });
    setEditDialogOpen(false);
    fetchWebinars();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this webinar?")) return;
    const { error } = await supabase.from("webinars").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting", variant: "destructive" });
      return;
    }
    toast({ title: "Webinar deleted" });
    fetchWebinars();
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = webinars.findIndex((w) => w.id === active.id);
    const newIndex = webinars.findIndex((w) => w.id === over.id);
    const reordered = arrayMove(webinars, oldIndex, newIndex);
    setWebinars(reordered);

    const items = reordered.map((w, i) => ({ id: w.id, sort_order: i }));
    await Promise.all(items.map(({ id, sort_order }) => supabase.from("webinars").update({ sort_order }).eq("id", id)));
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
            <Button onClick={handleLogin} className="w-full">
              Enter
            </Button>
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
        <span>Webinars</span>
      </nav>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manage Webinars</h1>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Home
        </Button>
      </div>

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
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description (shown smaller on the card)"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="details">Details</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Full details shown in the Details modal (line breaks preserved)"
              rows={6}
            />
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
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={webinars.map((w) => w.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {webinars.map((w) => (
                    <SortableWebinarRow key={w.id} webinar={w} onEdit={handleEditOpen} onDelete={handleDelete} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

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
              <Textarea
                id="edit-desc"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Short description (shown smaller on the card)"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-details">Details</Label>
              <Textarea
                id="edit-details"
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                placeholder="Full details shown in the Details modal (line breaks preserved)"
                rows={8}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} disabled={editLoading}>
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
