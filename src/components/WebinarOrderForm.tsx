import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useT } from "@/hooks/useT";
import { webinars as allWebinars } from "@/data/webinars";

interface OrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialWebinarSlug?: string;
}

const fieldBorder = "border-gold/40";

// Fix common mobile typos: comma or lowercase 'l' immediately before the TLD.
const fixCommonEmailTypos = (email: string): string => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (re.test(email)) return email;
  const fixed = email.replace(/[,l](?=[a-zA-Z]{2,24}$)/, ".");
  return re.test(fixed) ? fixed : email;
};

export const WebinarOrderForm = ({ open, onOpenChange, initialWebinarSlug }: OrderFormProps) => {
  const t = useT();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [email, setEmail] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialWebinarSlug ? [initialWebinarSlug] : []);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [undecided, setUndecided] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (open) setSuccess(false);
  }, [open]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setNote("");
    setSelectedDates([]);
    setPreferredTime("");
    setUndecided(false);
    setSelectedSlugs(initialWebinarSlug ? [initialWebinarSlug] : []);
    setSuccess(false);
  };

  React.useEffect(() => {
    if (open && initialWebinarSlug && !selectedSlugs.includes(initialWebinarSlug)) {
      setSelectedSlugs([initialWebinarSlug]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialWebinarSlug]);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const removeDate = (d: Date) => {
    setSelectedDates((prev) => prev.filter((x) => x.getTime() !== d.getTime()));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlugs.length === 0) {
      toast.error(t("Please select at least one webinar.", "Vyberte prosím alespoň jeden webinář."));
      return;
    }
    if (!undecided && selectedDates.length === 0) {
      toast.error(t("Please select a date or choose Undecided.", "Vyberte prosím datum nebo zvolte Nerozhodnuto."));
      return;
    }

    // Lenient email fix for common mobile typos
    const fixedEmail = fixCommonEmailTypos(email.trim());
    if (fixedEmail !== email) setEmail(fixedEmail);

    setLoading(true);

    const chosen_date = undecided ? ["Undecided"] : selectedDates.map((d) => format(d, "yyyy-MM-dd"));

    // Look up DB UUIDs for selected slugs (best effort; may be empty)
    const { data: dbWebinars } = await supabase.from("webinars").select("id, slug").in("slug", selectedSlugs);

    const session_id = (dbWebinars || []).map((w: { id: string }) => w.id);

    const { error } = await supabase.from("webinar_orders").insert([
      {
        customer_name: name,
        customer_email: fixedEmail,
        session_id: session_id[0] ?? undefined,
        chosen_date: [chosen_date.join(", "), preferredTime ? `Time: ${preferredTime}` : ""]
          .filter(Boolean)
          .join(" | "),
      },
    ]);

    setLoading(false);
    if (error) {
      toast.error(t("Order failed: ", "Objednávka selhala: ") + error.message);
      return;
    }
    console.log("selectedSlugs:", selectedSlugs);
    console.log(
      "allWebinars:",
      allWebinars.map((w) => w.slug),
    );
    console.log(
      "webinar_title:",
      allWebinars
        .filter((w) => selectedSlugs.includes(w.slug))
        .map((w) => w.title)
        .join(", "),
    );
    console.log("DEBUG note value:", note, "length:", note.length);
    console.log("INVOKE BODY note:", String(note), "preferredTime:", String(preferredTime));
    await supabase.functions.invoke("send-webinar-email", {
      body: {
        customer_name: name,
        customer_email: fixedEmail ?? email,
        chosen_date: chosen_date.join(", "),
        preferred_time: preferredTime,
        webinar_title: allWebinars
          .filter((w) => selectedSlugs.includes(w.slug))
          .map((w) => w.title)
          .join(", "),
        note: String(note),
      },
    });
    setSuccess(true);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Non-Binding Order", "Nezávazná objednávka")}</DialogTitle>
          <DialogDescription>{t("\n", "\n")}</DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-10 text-center space-y-6">
            <p className="text-lg font-medium whitespace-pre-line">
              {t(
                "🌿Thanks for your interest.🌿 \nHoward will be in touch faster than you can say 'synergy'. \nCheck your email tomorrow.",
                "🌿 Děkujeme za váš zájem 🌿\n\nHoward se vám ozve rychleji, než řeknete 'synergie'. \nZkontrolujte si zítra e-mail.",
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order-name">{t("Name", "Jméno")} *</Label>
                <Input
                  id="order-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldBorder}
                />
              </div>
              <div>
                <Label htmlFor="order-email">{t("Email", "Email")} *</Label>
                <Input
                  id="order-email"
                  type="email"
                  required
                  placeholder="your@bestemail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldBorder}
                />
              </div>
            </div>

            <div>
              <Label className="mb-1 block">{t("Select webinars", "Vyberte webináře")} *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                {t("Price: CZK 3,000 / €125 for a 90-minute session", "Cena: 3 000 Kč / 125 € za 90minutovou lekci")}
              </p>
              <div className="max-h-48 overflow-y-auto rounded-md border border-gold/40 p-3 space-y-2">
                {[...allWebinars]
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((w) => (
                    <label key={w.slug} className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80">
                      <Checkbox checked={selectedSlugs.includes(w.slug)} onCheckedChange={() => toggleSlug(w.slug)} />
                      <span>{w.title}</span>
                    </label>
                  ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block">{t("Preferred dates", "Preferované termíny")} *</Label>

              <label className="flex items-center gap-2 mb-3 text-sm cursor-pointer">
                <Checkbox
                  checked={undecided}
                  onCheckedChange={(v) => {
                    setUndecided(!!v);
                    if (v) setSelectedDates([]);
                  }}
                />
                <span className="font-medium">
                  {t("Undecided (decide later)", "Nerozhodnuto (rozhodnu se později)")}
                </span>
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={undecided}
                    className={cn(
                      "w-full justify-start text-left font-normal border-gold/40",
                      undecided && "opacity-50",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDates.length > 0
                      ? t(`${selectedDates.length} date(s) selected`, `Vybráno: ${selectedDates.length}`)
                      : t("Pick one or more dates", "Vyberte jeden nebo více termínů")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(d) => setSelectedDates(d ?? [])}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {selectedDates.length > 0 && !undecided && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedDates.map((d) => (
                    <Badge key={d.getTime()} variant="secondary" className="gap-1">
                      {format(d, "PPP")}
                      <button
                        type="button"
                        onClick={() => removeDate(d)}
                        className="ml-1 hover:opacity-70"
                        aria-label="remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="preferred-time" className="mb-2 block">
                {t("Preferred time", "Preferovaný čas")}
              </Label>
              <Input
                id="preferred-time"
                type="text"
                placeholder={t("e.g. 10:00 AM, mornings, after 5pm", "např. 10:00, dopoledne, po 17:00")}
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className={fieldBorder}
              />
            </div>

            <div className="space-y-1">
              <div className="rounded-md border border-gold/40 bg-gold/5 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">{t("Subtotal", "Mezisoučet")}</span>
                <span className="text-lg font-semibold text-gold">
                  {t(
                    `CZK ${(selectedSlugs.length * 3000).toLocaleString("en-US")} / €${selectedSlugs.length * 125}`,
                    `${(selectedSlugs.length * 3000).toLocaleString("cs-CZ")} Kč / ${selectedSlugs.length * 125} €`,
                  )}
                </span>
              </div>
              <p className="text-right text-sm font-semibold text-gold">
                {t("There is no payment now, we will be in touch", "Nyní se neplatí, ozveme se vám")}
              </p>
            </div>

            <div>
              <Label htmlFor="order-note" className="mb-2 block">
                {t("Optional note", "Volitelná poznámka")}
              </Label>
              <Textarea
                id="order-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("Any questions or special requests?", "Máte nějaké otázky nebo speciální požadavky?")}
                className={fieldBorder}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("Cancel", "Zrušit")}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? t("Submitting...", "Odesílám...")
                  : t("Submit non-binding order", "Odeslat nezávaznou objednávku")}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
