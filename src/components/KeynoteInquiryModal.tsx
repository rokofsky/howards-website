import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ContactForm from "@/components/ContactForm";
import { useT } from "@/hooks/useT";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const KeynoteInquiryModal = ({ open, onOpenChange }: Props) => {
  const t = useT();

  const presetTopics = [
    t("How to give proper directions & instructions", "Jak správně dávat pokyny a instrukce"),
    t("Brain Gym: get the hemispheres working together", "Brain Gym: propojte obě mozkové hemisféry"),
    t("Emotional Intelligence: how it can make your life easier", "Emoční inteligence: jak vám usnadní život"),
    t("Increase your memory!", "Zvyšte svou paměť!"),
    t("EQ & Leadership: how they go hand-in-hand", "EQ a vedení: jak jdou ruku v ruce"),
    t("Work-life Balance -- is it for me?", "Work-life Balance -- je to pro mě?"),
    t("8 Intelligences and how to increase yours", "8 inteligencí a jak tu svou zvýšit"),
    t("Self-motivation and concentration", "Sebemotivace a soustředění"),
    t("Time Management in 5 minutes a day", "Time management v 5 minutách denně"),
  ];

  const [selected, setSelected] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState("");
  const [showForm, setShowForm] = useState(false);

  const toggle = (topic: string) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelected([]);
      setCustomTopic("");
      setShowForm(false);
    }
    onOpenChange(open);
  };

  const topicsForMessage = [...selected, ...(customTopic.trim() ? [customTopic.trim()] : [])];
  const serviceName = t("Keynote Speaking", "Hlavní přednáška") +
    (topicsForMessage.length ? ` — ${topicsForMessage.join(", ")}` : "");

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetTopics.map((topic) => {
                const checked = selected.includes(topic);
                return (
                  <label
                    key={topic}
                    className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                      checked ? "border-gold bg-gold/5" : "border-border hover:border-gold/50"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggle(topic)}
                      className="mt-0.5"
                    />
                    <span className="text-sm leading-snug">{topic}</span>
                  </label>
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
            <ContactForm serviceName={serviceName} showServiceFields formKind="service" />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default KeynoteInquiryModal;
