import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, useToast } from "@/hooks/use-toast";
import { Trash2, Pencil, Loader2, Languages, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  isAdminAuthenticated,
  setAdminAuthenticated,
  clearAdminAuthenticated,
  verifyAdminPassword,
} from "@/lib/adminAuth";

const categories = ["Mindset", "Personal", "Storytelling", "Leadership", "Communication"];

async function translateToCzech(text: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  "Translate the following English text into fluent, natural Czech. Preserve line breaks and formatting. Return ONLY the translated text, no commentary:\n\n" +
                  text,
              },
            ],
          },
        ],
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
  const data = await res.json();
  const out = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!out || typeof out !== "string") throw new Error("Empty translation response");
  return out.trim();
}

interface BlogPostRow {
  id: string;
  slug: string;
  title_en: string;
  title_cs: string;
  excerpt_en: string;
  excerpt_cs: string;
  content_en: string;
  content_cs: string;
  category_en: string;
  category_cs: string;
  date_en: string;
  date_cs: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
}

interface KeynoteTopic {
  id: string;
  title: string;
  description: string;
  sort_order: number;
  active: boolean;
}

function SortableKeynoteRow({
  topic,
  onBlurField,
  onActive,
  onDelete,
  onEdit,
}: {
  topic: KeynoteTopic;
  onBlurField: (id: string, field: "title" | "description", value: string) => void;
  onActive: (id: string, value: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (topic: KeynoteTopic) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: topic.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 py-1 px-2">
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Input
        defaultValue={topic.title}
        placeholder="Topic title"
        className="flex-1 border-0 focus-visible:ring-0 shadow-none px-2 bg-transparent"
        onBlur={(e) => onBlurField(topic.id, "title", e.target.value)}
      />
      <button onClick={() => onEdit(topic)} aria-label="Edit topic">
        <Pencil className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </button>
      <Switch checked={topic.active} onCheckedChange={(v) => onActive(topic.id, v)} />
      <button onClick={() => onDelete(topic.id)} aria-label="Delete topic">
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>
    </div>
  );
}

const RokofAdmin = () => {
  const navigate = useNavigate();
  const { dismiss } = useToast();
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const [password, setPassword] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Blog generator state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedSlug, setGeneratedSlug] = useState("");

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPostRow | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  // Keynote Topics state
  const [keynoteTopics, setKeynoteTopics] = useState<
    { id: string; title: string; description: string; sort_order: number; active: boolean }[]
  >([]);
  const [editingKeynote, setEditingKeynote] = useState<KeynoteTopic | null>(null);
  const [deletingKeynoteId, setDeletingKeynoteId] = useState<string | null>(null);
  const [isKeynoteExpanded, setIsKeynoteExpanded] = useState(false);
  const fetchKeynoteTopics = async () => {
    const { data, error } = await supabase.from("keynote_topics").select("*").order("sort_order", { ascending: true });
    if (!error && data) setKeynoteTopics(data);
  };

  const handleKeynoteAdd = async () => {
    const maxOrder = keynoteTopics.length > 0 ? Math.max(...keynoteTopics.map((t) => t.sort_order)) : 0;
    const { error } = await supabase
      .from("keynote_topics")
      .insert([{ title: "", description: "", sort_order: maxOrder + 1, active: true }]);
    if (!error) fetchKeynoteTopics();
  };

  const confirmKeynoteDelete = (id: string) => {
    setDeletingKeynoteId(id);
  };

  const handleKeynoteDelete = async () => {
    if (!deletingKeynoteId) return;
    await supabase.from("keynote_topics").delete().eq("id", deletingKeynoteId);
    setKeynoteTopics((prev) => prev.filter((t) => t.id !== deletingKeynoteId));
    setDeletingKeynoteId(null);
  };

  const handleKeynoteBlur = async (id: string, field: "title" | "description", value: string) => {
    await supabase
      .from("keynote_topics")
      .update({ [field]: value } as { title?: string; description?: string })
      .eq("id", id);
  };

  const handleKeynoteActive = async (id: string, value: boolean) => {
    await supabase.from("keynote_topics").update({ active: value }).eq("id", id);
    setKeynoteTopics((prev) => prev.map((t) => (t.id === id ? { ...t, active: value } : t)));
  };

  const handleKeynoteDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = keynoteTopics.findIndex((t) => t.id === active.id);
    const newIndex = keynoteTopics.findIndex((t) => t.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    const reordered = arrayMove(keynoteTopics, oldIndex, newIndex).map((t, i) => ({ ...t, sort_order: i + 1 }));
    setKeynoteTopics(reordered);
    await Promise.all(
      reordered.map((t) => supabase.from("keynote_topics").update({ sort_order: t.sort_order }).eq("id", t.id)),
    );
  };
  const loadPosts = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*");
    console.log("Admin Component Fetch - Data:", data, "Error:", error);
    setPosts((data as BlogPostRow[]) ?? []);
  };

  useEffect(() => {
    if (authenticated) {
      void loadPosts();
      fetchKeynoteTopics();
    }
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await verifyAdminPassword(password);
    if (ok) {
      dismiss();
      localStorage.setItem("admin_authenticated", "true");
      setAuthenticated(true);
      setPassword("");
    } else {
      toast({ title: "Incorrect password", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    clearAdminAuthenticated();
    setAuthenticated(false);
    setPassword("");
  };

  const generateSlug = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleGenerate = async () => {
    if (!title || !category || !excerpt || !content) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const slug = generateSlug(title);

    const { error } = await supabase.from("blog_posts").insert({
      slug,
      title_en: title,
      title_cs: title,
      excerpt_en: excerpt,
      excerpt_cs: excerpt,
      content_en: content,
      content_cs: content,
      category_en: category,
      category_cs: category,
      date_en: dateStr,
      date_cs: dateStr,
      image_url: imageUrl || null,
      published: true,
    });

    if (error) {
      toast({ title: "Failed to create post", description: error.message, variant: "destructive" });
      return;
    }

    setGeneratedSlug(slug);
    toast({ title: "Post created", description: "It's now live on the blog." });
    setTitle("");
    setCategory("");
    setExcerpt("");
    setContent("");
    setImageUrl("");
    await loadPosts();
  };

  const handleDelete = async (post: BlogPostRow) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    toast({ title: "Post deleted" });
  };

  const handleTogglePublished = async (post: BlogPostRow, value: boolean) => {
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: value } : p)));
    const { error } = await supabase.from("blog_posts").update({ published: value }).eq("id", post.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      await loadPosts();
    }
  };

  const handleTranslate = async (field: "title_cs" | "excerpt_cs" | "content_cs" | "category_cs") => {
    if (!editingPost) return;
    const sourceMap: Record<typeof field, keyof BlogPostRow> = {
      title_cs: "title_en",
      excerpt_cs: "excerpt_en",
      content_cs: "content_en",
      category_cs: "category_en",
    };
    const source = editingPost[sourceMap[field]] as string;
    if (!source?.trim()) {
      toast({ title: "Nothing to translate", variant: "destructive" });
      return;
    }
    setTranslating(field);
    try {
      const out = await translateToCzech(source);
      setEditingPost({ ...editingPost, [field]: out });
    } catch (e) {
      toast({
        title: "Translation failed — please translate manually",
        description: e instanceof Error ? e.message : undefined,
        variant: "destructive",
      });
    } finally {
      setTranslating(null);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    setSavingEdit(true);
    const { id, slug, published, created_at, ...rest } = editingPost;
    const { error } = await supabase
      .from("blog_posts")
      .update({
        title_en: rest.title_en,
        title_cs: rest.title_cs,
        excerpt_en: rest.excerpt_en,
        excerpt_cs: rest.excerpt_cs,
        content_en: rest.content_en,
        content_cs: rest.content_cs,
        category_en: rest.category_en,
        category_cs: rest.category_cs,
        date_en: rest.date_en,
        date_cs: rest.date_cs,
        image_url: rest.image_url,
      })
      .eq("id", id);
    setSavingEdit(false);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
      return;
    }
    setEditingPost(null);
    toast({ title: "Post updated" });
    await loadPosts();
  };

  if (!authenticated) {
    return (
      <Layout>
        <section className="section-padding pt-24">
          <div className="max-w-sm mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">Admin Access</h1>
            <form onSubmit={handleLogin} className="glass rounded-xl p-8 space-y-4">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <Button type="submit" variant="cta" className="w-full">
                Enter
              </Button>
            </form>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold">Admin Hub</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            <Link to="/admin/sessions" className="glass rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-1">Manage Storytelling Sessions</h3>
              <p className="text-sm text-muted-foreground">Create and manage sessions</p>
            </Link>
            <Link to="/admin/webinars" className="glass rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-1">Manage Webinars</h3>
              <p className="text-sm text-muted-foreground">Create and manage webinars</p>
            </Link>
          </div>

          {/* Manage Blog Posts */}
          <div className="glass rounded-xl p-8 mb-14">
            <h2 className="text-xl font-bold mb-2">Manage Blog Posts</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Toggle visibility or permanently delete posts. Changes apply immediately.
            </p>
            {posts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No posts yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {posts.map((post) => (
                  <li key={post.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{post.title_en}</p>
                      <p className="text-xs text-muted-foreground">{post.date_en}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{post.published ? "Published" : "Hidden"}</span>
                      <Switch checked={post.published} onCheckedChange={(v) => handleTogglePublished(post, v)} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setEditingPost(post)} aria-label="Edit post">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post)} aria-label="Delete post">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="glass rounded-xl px-8 py-4 mb-14">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold">Reference Scans (PDF)</span> — upload to GitHub at:
              src/components/EvaluationsGallery.tsx
            </p>
          </div>
          {/* Blog Post Generator */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold mb-6">New Blog Post</h2>
            <div className="space-y-4">
              <div>
                <Label>Title *</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title" />
              </div>
              <div>
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Short Description *</Label>
                <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One-line summary" />
              </div>
              <div>
                <Label>Image URL (optional)</Label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div>
                <Label>Full Content *</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the full article..."
                  className="min-h-[200px]"
                />
              </div>
              <div className="flex gap-3">
                <Button variant="cta" onClick={handleGenerate}>
                  Publish Post
                </Button>
                {generatedSlug && (
                  <Button variant="outline" onClick={() => navigate(`/blog/${generatedSlug}`)}>
                    View Last Post →
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <Label>Title (EN)</Label>
                <Input
                  value={editingPost.title_en}
                  onChange={(e) => setEditingPost({ ...editingPost, title_en: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Title (CS)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={translating === "title_cs"}
                    onClick={() => handleTranslate("title_cs")}
                  >
                    {translating === "title_cs" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="h-3.5 w-3.5 mr-1" />
                    )}
                    {translating === "title_cs" ? "Translating..." : "Translate from EN"}
                  </Button>
                </div>
                <Input
                  value={editingPost.title_cs}
                  onChange={(e) => setEditingPost({ ...editingPost, title_cs: e.target.value })}
                />
              </div>
              <div>
                <Label>Category (EN)</Label>
                <Input
                  value={editingPost.category_en}
                  onChange={(e) => setEditingPost({ ...editingPost, category_en: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Category (CS)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={translating === "category_cs"}
                    onClick={() => handleTranslate("category_cs")}
                  >
                    {translating === "category_cs" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="h-3.5 w-3.5 mr-1" />
                    )}
                    {translating === "category_cs" ? "Translating..." : "Translate from EN"}
                  </Button>
                </div>
                <Input
                  value={editingPost.category_cs}
                  onChange={(e) => setEditingPost({ ...editingPost, category_cs: e.target.value })}
                />
              </div>
              <div>
                <Label>Date (EN)</Label>
                <Input
                  value={editingPost.date_en}
                  onChange={(e) => setEditingPost({ ...editingPost, date_en: e.target.value })}
                />
              </div>
              <div>
                <Label>Date (CS)</Label>
                <Input
                  value={editingPost.date_cs}
                  onChange={(e) => setEditingPost({ ...editingPost, date_cs: e.target.value })}
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={editingPost.image_url ?? ""}
                  onChange={(e) => setEditingPost({ ...editingPost, image_url: e.target.value })}
                />
              </div>
              <div>
                <Label>Excerpt (EN)</Label>
                <Textarea
                  className="min-h-[140px]"
                  value={editingPost.excerpt_en}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt_en: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Excerpt (CS)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={translating === "excerpt_cs"}
                    onClick={() => handleTranslate("excerpt_cs")}
                  >
                    {translating === "excerpt_cs" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="h-3.5 w-3.5 mr-1" />
                    )}
                    {translating === "excerpt_cs" ? "Translating..." : "Translate from EN"}
                  </Button>
                </div>
                <Textarea
                  className="min-h-[140px]"
                  value={editingPost.excerpt_cs}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt_cs: e.target.value })}
                />
              </div>
              <div>
                <Label>Content (EN)</Label>
                <Textarea
                  className="min-h-[140px]"
                  value={editingPost.content_en}
                  onChange={(e) => setEditingPost({ ...editingPost, content_en: e.target.value })}
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Content (CS)</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    disabled={translating === "content_cs"}
                    onClick={() => handleTranslate("content_cs")}
                  >
                    {translating === "content_cs" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Languages className="h-3.5 w-3.5 mr-1" />
                    )}
                    {translating === "content_cs" ? "Translating..." : "Translate from EN"}
                  </Button>
                </div>
                <Textarea
                  className="min-h-[140px]"
                  value={editingPost.content_cs}
                  onChange={(e) => setEditingPost({ ...editingPost, content_cs: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPost(null)} disabled={savingEdit}>
              Cancel
            </Button>
            <Button variant="cta" onClick={handleSaveEdit} disabled={savingEdit}>
              {savingEdit ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setIsKeynoteExpanded(prev => !prev)} className="flex items-center justify-between w-full text-left">
  <h2 className="text-xl font-bold">Manage Keynote Topics</h2>
  <span>{isKeynoteExpanded ? "▲" : "▼"}</span>
</button>
            </div>
           {isKeynoteExpanded && (
  <>
    <div className="flex justify-end mb-2">
  <Button variant="cta" size="sm" onClick={handleKeynoteAdd}>
    + Add topic
  </Button>
</div>
    {keynoteTopics.length === 0 ? (
      <p className="text-sm text-muted-foreground">No topics yet.</p>
    ) : (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleKeynoteDragEnd}>
        <SortableContext items={keynoteTopics.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="divide-y divide-border">
            {keynoteTopics.map((topic) => (
              <SortableKeynoteRow
                key={topic.id}
                topic={topic}
                onBlurField={handleKeynoteBlur}
                onActive={handleKeynoteActive}
                onDelete={confirmKeynoteDelete}
                onEdit={setEditingKeynote}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )}
  </>
)}
          </div>
        </div>
      </section>

      <Dialog open={!!editingKeynote} onOpenChange={(open) => !open && setEditingKeynote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingKeynote?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label>Description</Label>
            <Textarea
              defaultValue={editingKeynote?.description ?? ""}
              className="min-h-[120px]"
              onBlur={(e) => {
                if (editingKeynote) handleKeynoteBlur(editingKeynote.id, "description", e.target.value);
              }}
              placeholder="Enter description for this keynote topic..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingKeynote(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};
export default RokofAdmin;
