import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { FileText, Trash2, Upload } from "lucide-react";

const TOTAL = 80;
const BUCKET = "reference-scans";

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
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const ReferenceScansManager = ({ password }: { password: string }) => {
  const [scans, setScans] = useState<Record<number, ScanRow>>({});
  const [busy, setBusy] = useState<number | null>(null);
  const [titles, setTitles] = useState<Record<number, string>>({});

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
    if (file.type !== "application/pdf") {
      toast({ title: "Only PDF files allowed", variant: "destructive" });
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
    if (!confirm(`Delete scan in slot ${slot}?`)) return;
    setBusy(slot);
    try {
      const { data, error } = await supabase.functions.invoke("admin-reference-scans", {
        body: { password, action: "delete", slot_number: slot },
      });
      if (error || data?.error) throw new Error(data?.error || error?.message);
      toast({ title: `Slot ${slot} deleted` });
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: TOTAL }, (_, i) => i + 1).map((slot) => {
        const scan = scans[slot];
        const isBusy = busy === slot;
        return (
          <div key={slot} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">Slot #{slot}</span>
              {scan ? (
                <a
                  href={publicUrl(scan.pdf_path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent flex items-center gap-1 hover:underline"
                >
                  <FileText className="w-3 h-3" /> View
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">Empty</span>
              )}
            </div>
            <Input
              placeholder="Title (optional)"
              value={titles[slot] ?? ""}
              onChange={(e) => setTitles((p) => ({ ...p, [slot]: e.target.value }))}
              className="h-8 text-xs"
            />
            <div className="flex gap-2">
              <label className="flex-1">
                <input
                  type="file"
                  accept="application/pdf"
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
                    {scan ? "Replace" : "Upload"}
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
