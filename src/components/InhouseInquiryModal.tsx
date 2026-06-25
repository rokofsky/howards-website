import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContactForm from "@/components/ContactForm";
import { useT } from "@/hooks/useT";
import { supabase } from "@/integrations/supabase/client";

interface InhouseWorkshop {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  sort_order: number;
  active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedWorkshop?: string;
}

const InhouseInquiryModal = ({ open, onOpenChange, preselectedWorkshop }: Props) => {
  const t = useT();
  const [workshops, setWorkshops] = useState<InhouseWorkshop[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (supabase.from("inhouse_workshops" as never) as never as {
      select: (cols: string) => {
        eq: (col: string, val: boolean) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{
            data: InhouseWorkshop[] | null;
            error: unknown;
          }>;
        };
      };
    })
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setWorkshops(data);
        setLoading(false);
      });
  }, [open]);

  useEffect(() => {
    if (open && preselectedWorkshop) {
      setSelected([preselectedWorkshop]);
    }
  }, [open, preselectedWorkshop]);

  const toggle = (title: string) => {
    setSelected((prev) => (prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]));
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelected([]);
      setCustomTopic("");
      setShowForm(false);
      setExpandedId(null);
    }
    onOpenChange(open);
  };

  const topicsForMessage = [...selected, ...(customTopic.trim() ? [customTopic.trim()] : [])];
  const serviceName = t("Inhouse Workshops", "Firemní workshopy") +
    (topicsForMessage.length ? ` — ${topicsForMessage.join(", ")}` : "");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Inhouse Workshops Inquiry", "Poptávka firemního workshopu")}</DialogTitle>
          <DialogDescription>
            {t("Click on any of these or add your own topic", "Vyberte si z těchto témat nebo přidejte vlastní")}
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-border p-3 flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full bg-muted shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              style={{ gridAutoFlow: "column", gridTemplateRows: `repeat(${Math.ceil(workshops.length / 2)}, auto)` }}
            >
              {workshops.map((w) => {
                const checked = selected.includes(w.title);
                const isExpanded = expandedId === w.id;
                const hasDetails = !!(w.description || w.duration);
                return (
                  <div key={w.id} className="flex flex-col">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                      }`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(w.title)} className="mt-0.5" />
                      <span className="text-sm leading-snug flex-1">{w.title}</span>
                      {hasDetails && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedId(isExpanded ? null : w.id);
                          }}
                          className="text-xs text-gold underline shrink-0"
                        >
                          {isExpanded ? t("less", "méně") : t("more", "více")}
                        </button>
                      )}
                    </label>
                    {isExpanded && hasDetails && (
                      <div className="text-xs text-foreground/70 bg-muted/40 rounded-b-md px-3 py-2 border border-t-0 border-border space-y-1">
                        {w.description && <div>{w.description}</div>}
                        {w.duration && (
                          <div className="font-medium">
                            {t("Duration:", "Délka:")} {w.duration}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            )}

            <div className="space-y-2 pt-2">
              <Label htmlFor="inhouse-custom-topic">{t("Add your own topic", "Přidat vlastní téma")}</Label>
              <Input
                id="inhouse-custom-topic"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={t("Tell me what you're really thinking", "Řekněte mi, co Vás opravdu zajímá")}
                className="placeholder:text-muted-foreground/50 placeholder:font-light"
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-2">
              <Button type="button" variant="ghost" onClick={() => handleClose(false)}>
                {t("Cancel", "Zrušit")}
              </Button>
              <Button
                type="button"
                variant="cta"
                onClick={() => setShowForm(true)}
                disabled={topicsForMessage.length === 0}
              >
                {t("Continue", "Pokračovat")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="rounded-md border border-gold/30 bg-gold/5 p-3 text-sm">
              <div className="font-medium mb-1">{t("Selected topics:", "Vybraná témata:")}</div>
              <ul className="list-disc list-inside space-y-0.5 text-foreground/80">
                {topicsForMessage.map((tpc) => <li key={tpc}>{tpc}</li>)}
              </ul>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="mt-2 text-xs text-gold underline"
              >
                {t("Edit topics", "Upravit témata")}
              </button>
            </div>
            <ContactForm
              serviceName={serviceName}
              showServiceFields
              formKind="service"
              onSuccess={() => {
                const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
                if (typeof gtag === "function") {
                  gtag("event", "generate_lead", {
                    event_category: "engagement",
                    event_label: "Inhouse Workshop Inquiry",
                  });
                }
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InhouseInquiryModal;
