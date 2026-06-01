import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast, useToast } from "@/hooks/use-toast";
import ReferenceScansManager from "@/components/admin/ReferenceScansManager";
import { addSessionPost } from "@/data/blogStore";

const categories = ["Mindset", "Personal", "Storytelling", "Leadership", "Communication"];

const RokofAdmin = () => {
  const navigate = useNavigate();
  const { dismiss } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [password, setPassword] = useState("");

  // Blog generator state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedSlug, setGeneratedSlug] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await supabase.functions.invoke("admin-sessions", {
        method: "POST",
        body: { password, action: "verify" },
      });
      if (res.data?.ok) {
        dismiss();
        setAdminPassword(password);
        setAuthenticated(true);
        setPassword("");
      } else {
        toast({ title: "Incorrect password", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error verifying password", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setAdminPassword("");
    setAuthenticated(false);
    setPassword("");
  };


  const generateSlug = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleGenerate = () => {
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
    const escapedContent = content.replace(/`/g, "\\`").replace(/\$/g, "\\$");

    const code = `  {
    slug: "${slug}",
    title: "${title.replace(/"/g, '\\"')}",
    excerpt: "${excerpt.replace(/"/g, '\\"')}",
    date: "${dateStr}",
    category: "${category}",${imageUrl ? `\n    imageUrl: "${imageUrl}",` : ""}
    content: \`${escapedContent}\`,
  },`;

    setGeneratedCode(code);
    setGeneratedSlug(slug);

    addSessionPost({
      slug,
      title: { en: title, cs: title },
      excerpt: { en: excerpt, cs: excerpt },
      date: { en: dateStr, cs: dateStr },
      category: { en: category, cs: category },
      imageUrl: imageUrl || undefined,
      content: { en: content, cs: content },
    });

    toast({
      title: "Post added (session preview)",
      description: "Scroll down — copy the generated code and ask Lovable to make it permanent.",
    });

    // Scroll the generated code into view (no auto-redirect)
    setTimeout(() => {
      document.getElementById("generated-code-block")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({ title: "Copied to clipboard!" });
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

          {/* Blog Post Generator */}
          <div className="glass rounded-xl p-8">
            <h2 className="text-xl font-bold mb-6">Blog Post Generator</h2>
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
              <Button variant="cta" onClick={handleGenerate}>
                Generate Post
              </Button>
            </div>

            {generatedCode && (
              <div id="generated-code-block" className="mt-8 space-y-3">
                <div className="rounded-md border border-accent/40 bg-accent/10 p-3 text-xs">
                  <strong>Post added to session preview.</strong> To make it permanent for everyone,
                  copy the code below and ask Lovable to{" "}
                  <em>"add this post to src/data/blogPosts.ts"</em>.
                </div>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-bold text-sm">Generated Code</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      Copy
                    </Button>
                    <Button variant="cta" size="sm" onClick={() => navigate(`/blog/${generatedSlug}`)}>
                      View on Blog →
                    </Button>
                  </div>
                </div>
                <Textarea
                  readOnly
                  value={generatedCode}
                  className="font-mono text-xs min-h-[260px] bg-primary/90 text-primary-foreground"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <p className="text-xs text-muted-foreground">
                  Paste this into the <code>blogPosts</code> array in <code>src/data/blogPosts.ts</code>.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RokofAdmin;
