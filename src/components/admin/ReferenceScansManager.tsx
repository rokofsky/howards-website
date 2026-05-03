import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FileText, Trash2, Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const TOTAL = 80;
const BUCKET = "reference-scans";
const ACCEPTED_MIME = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ACCEPT_ATTR = "application/pdf,image/jpeg,image/png,image/webp";

interface ScanRow {
  slot_number: number;
  pdf_path: string;
  title: string | null;
}

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const fileNameFromPath = (path: string) => {
  const base = path.split("/").pop() || path;
  // strip leading "<timestamp>-"
  return base.replace(/^\d+-/, "");
};

const isImagePath = (path: string) =>
  /\.(jpg|jpeg|png|webp)$/i.test(path);

const ReferenceScansManager = ({ password }: { password: string }) => {
  const [scans, setScans] = useState<Record<number, ScanRow>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [titles, setTitles] = useState<Record<number, string>>({});
  const [dragSlot, setDragSlot] = useState<number | null>(null);
  const dragCounter = useRef<Record<number, number>>({});

  const load = async () => {
    const { data } = await supabase
      .from("reference_scans")
      .select("slot_number,pdf_path,title")
      .order("slot_number", { ascending: true });
    if (!data) return;
    const map: Record<number, ScanRow> = {};
    const t: Record<number, string> = {};
    for (const r of data as ScanRow[]) {
      map[r.slot_number] = r;
      t[r.slot_number] = r.title ?? "";
    }
    setScans(map);
    setTitles((prev) => ({ ...t, ...prev }));
  };

  useEffect(() => {
    load();
  }, []);

  const publicUrl = (path: string) =>
    supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const upload = async (slot: number, file: File) => {
    if (!ACCEPTED_MIME.includes(file.type)) {
      toast({ title: "Please use PDF or Image files.", variant: "destructive" });
      return;
    }
    setBusy(slot);
    try {
      const file_base64 = await fileToBase64(file);
      const { data, error } = await supabase.functions.invoke("admin-reference-scans", {
        body: {
          password,
          action: "upload",
          slot_number: slot,
          file_base64,
          file_name: file.name,
          content_type: file.type,
          title: titles[slot] || null,
        },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast({ title: `Slot ${slot} uploaded` });
      await load();
    } catch (e) {
      toast({ title: "Upload failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const remove = async (slot: number) => {
    if (!confirm(`Delete file in slot ${slot}?`)) return;
    setBusy(slot);
    try {
      const { data, error } = await supabase.functions.invoke("admin-reference-scans", {
        body: { password, action: "delete", slot_number: slot },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast({ title: `Slot ${slot} cleared` });
      await load();
    } catch (e) {
      toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const saveTitle = async (slot: number) => {
    setBusy(slot);
    try {
      const { data, error } = await supabase.functions.invoke("admin-reference-scans", {
        body: { password, action: "update_title", slot_number: slot, title: titles[slot] || null },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast({ title: `Slot ${slot} title updated` });
      await load();
    } catch (e) {
      toast({ title: "Update failed", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusy(null);
    }
  };

  const onDrop = (slot: number) => (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current[slot] = 0;
    setDragSlot(null);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      toast({ title: "Please use PDF or Image files.", variant: "destructive" });
      return;
    }
    upload(slot, file);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: TOTAL }, (_, i) => i + 1).map((slot) => {
        const scan = scans[slot];
        const isBusy = busy === slot;
        const isDragging = dragSlot === slot;
        const isImg = scan && isImagePath(scan.pdf_path);
        return (
          <div
            key={slot}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragCounter.current[slot] = (dragCounter.current[slot] || 0) + 1;
              setDragSlot(slot);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              dragCounter.current[slot] = (dragCounter.current[slot] || 1) - 1;
              if ((dragCounter.current[slot] || 0) <= 0) setDragSlot(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={onDrop(slot)}
            className={cn(
              "border rounded-lg p-4 space-y-3 transition-colors",
              isDragging
                ? "border-accent border-2 bg-accent/10"
                : "border-border",
              isBusy && "opacity-60"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Slot #{slot}</span>
              <div className="flex items-center gap-2">
                {scan ? (
                  <>
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      File Uploaded
                    </span>
                    <a
                      href={publicUrl(scan.pdf_path)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent flex items-center gap-1 hover:underline"
                    >
                      {isImg ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />} View
                    </a>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">Empty</span>
                )}
              </div>
            </div>

            <Input
              placeholder="Title (optional)"
              value={titles[slot] ?? ""}
              onChange={(e) => setTitles((p) => ({ ...p, [slot]: e.target.value }))}
              className="h-8 text-xs"
            />

            {scan && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 rounded px-2 py-1">
                <span className="truncate flex-1" title={fileNameFromPath(scan.pdf_path)}>
                  {fileNameFromPath(scan.pdf_path)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(slot)}
                  disabled={isBusy}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept={ACCEPT_ATTR}
                  className="hidden"
                  disabled={isBusy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(slot, f);
                    e.target.value = "";
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full pointer-events-none"
                  disabled={isBusy}
                  asChild
                >
                  <span className="flex items-center justify-center gap-1">
                    <Upload className="w-3 h-3" />
                    {scan ? "Replace" : isDragging ? "Drop to upload" : "Upload or drop"}
                  </span>
                </Button>
              </label>
              {scan && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveTitle(slot)}
                    disabled={isBusy}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(slot)}
                    disabled={isBusy}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReferenceScansManager;
