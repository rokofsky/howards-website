import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/hooks/use-toast";
import ReferenceScansManager from "@/components/admin/ReferenceScansManager";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ADMIN_PASSWORD,
  isAdminAuthenticated,
  setAdminAuthenticated,
  clearAdminAuthenticated,
} from "@/lib/adminAuth";

const categories = ["Mindset", "Personal", "Storytelling", "Leadership", "Communication"];

interface BlogPostRow {
  id: string;
  slug: string;
  title_en: string;
  date_en: string;
  published: boolean;
  created_at: string;
}

const RokofAdmin = () => {
  const navigate = useNavigate();
  const { dismiss } = useToast();
  const [authenticated, setAuthenticated] = useState<boolean>(() => isAdminAuthenticated());
  const adminPassword = ADMIN_PASSWORD;
  const [password, setPassword] = useState("");

  // Blog generator state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedSlug, setGeneratedSlug] = useState("");

  const [posts, setPosts] = useState<BlogPostRow[]>([]);

  const loadPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id,slug,title_en,date_en,published,created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    setPosts((data as BlogPostRow[]) ?? []);
  };

  useEffect(() => {
    if (authenticated) void loadPosts();
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      dismiss();
      setAdminAuthenticated();
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Admin Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
            <Link
              to="/admin/sessions"
              className="glass rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg mb-1">Manage Storytelling Sessions</h3>
              <p className="text-sm text-muted-foreground">Create and manage sessions</p>
            </Link>
            <Link
              to="/admin/webinars"
              className="glass rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-lg mb-1">Manage Webinars</h3>
              <p className="text-sm text-muted-foreground">Create and manage webinars</p>
            </Link>
          </div>

          {/* Reference Scans Manager */}
          <div className="glass rounded-xl p-8 mb-14">
            <h2 className="text-xl font-bold mb-2">Reference Scans (PDF)</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload, replace, or delete the 80 evaluation form PDFs shown on the References page.
            </p>
            <ReferenceScansManager password={adminPassword} />
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
                      <span className="text-xs text-muted-foreground">
                        {post.published ? "Published" : "Hidden"}
                      </span>
                      <Switch
                        checked={post.published}
                        onCheckedChange={(v) => handleTogglePublished(post, v)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post)}
                      aria-label="Delete post"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
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
                      <SelectItem key={c} value={c}>{c}</SelectItem>
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
    </Layout>
  );
};

export default RokofAdmin;
