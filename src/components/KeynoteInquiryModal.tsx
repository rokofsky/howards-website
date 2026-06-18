import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContactForm from "@/components/ContactForm";
import { useT } from "@/hooks/useT";
import { supabase } from "@/integrations/supabase/client";

interface KeynoteTopic {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  active: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeynoteInquiryModal = ({ open, onOpenChange }: Props) => {
  const t = useT();
  const [topics, setTopics] = useState<KeynoteTopic[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!open) return;
    supabase
      .from("keynote_topics")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setTopics(data);
      });
  }, [open]);

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
  const serviceName =
    t("Keynote Speaking", "Hlavní přednáška") + (topicsForMessage.length ? ` — ${topicsForMessage.join(", ")}` : "");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Keynote Speaking Inquiry", "Poptávka přednášky")}</DialogTitle>
          <DialogDescription>
            {t("Click on any of these or add your own topic", "Vyberte si z těchto témat nebo přidejte vlastní")}
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              style={{ gridAutoFlow: "column", gridTemplateRows: `repeat(${Math.ceil(topics.length / 2)}, auto)` }}
            >
              {topics.map((topic) => {
                const checked = selected.includes(topic.title);
                const isExpanded = expandedId === topic.id;
                return (
                  <div key={topic.id} className="flex flex-col">
                    <label
                      className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                        checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                      }`}
                    >
                      <Checkbox checked={checked} onCheckedChange={() => toggle(topic.title)} className="mt-0.5" />
                      <span className="text-sm leading-snug">{topic.title}</span>
                      <span
                        className="flex-1"
                        onClick={(e) => {
                          e.preventDefault();
                          if (topic.description) setExpandedId(isExpanded ? null : topic.id);
                        }}
                      />
                      {topic.description && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setExpandedId(isExpanded ? null : topic.id);
                          }}
                          className="text-xs text-gold underline shrink-0"
                        >
                          {isExpanded ? t("less", "méně") : t("more", "více")}
                        </button>
                      )}
                    </label>
                    {isExpanded && topic.description && (
                      <div className="text-xs text-foreground/70 bg-muted/40 rounded-b-md px-3 py-2 border border-t-0 border-border">
                        {topic.description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="custom-topic">{t("Add your own topic", "Přidat vlastní téma")}</Label>
              <Input
                id="custom-topic"
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
                {topicsForMessage.map((tpc) => (
                  <li key={tpc}>{tpc}</li>
                ))}
              </ul>
              <button type="button" onClick={() => setShowForm(false)} className="mt-2 text-xs text-gold underline">
                {t("Edit topics", "Upravit témata")}
              </button>
            </div>
            <ContactForm serviceName={serviceName} showServiceFields formKind="service" />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KeynoteInquiryModal;
