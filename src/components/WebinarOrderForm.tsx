import React, { useState } from "react";
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

export const WebinarOrderForm = ({ open, onOpenChange, initialWebinarSlug }: OrderFormProps) => {
  const t = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    initialWebinarSlug ? [initialWebinarSlug] : []
  );
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [undecided, setUndecided] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open && initialWebinarSlug && !selectedSlugs.includes(initialWebinarSlug)) {
      setSelectedSlugs([initialWebinarSlug]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialWebinarSlug]);

  const toggleSlug = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
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
    setLoading(true);

    const chosen_dates = undecided
      ? ["Undecided"]
      : selectedDates.map((d) => format(d, "yyyy-MM-dd"));

    // Look up DB UUIDs for selected slugs (best effort; may be empty)
    const { data: dbWebinars } = await supabase
      .from("webinars")
      .select("id, slug")
      .in("slug", selectedSlugs);

    const session_ids = (dbWebinars || []).map((w: { id: string }) => w.id);

    const { error } = await supabase.from("webinar_orders").insert([
      {
        customer_name: name,
        customer_email: email,
        session_ids: session_ids.length > 0 ? session_ids : null,
        chosen_dates,
        // legacy fields kept for compatibility
        session_id: session_ids[0] ?? null,
        chosen_date: chosen_dates.join(", ") + (preferredTime ? ` | Preferred time: ${preferredTime}` : ""),
      },
    ]);

    setLoading(false);
    if (error) {
      toast.error(t("Order failed: ", "Objednávka selhala: ") + error.message);
      return;
    }
    onOpenChange(false);
    setName("");
    setEmail("");
    setPreferredTime("");
    setSelectedDates([]);
    setUndecided(false);
    toast.success(t("Howard will send you an email within 24 hours.", "Howard vám pošle e-mail do 24 hodin."));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Non-Binding Order", "Nezávazná objednávka")}</DialogTitle>
          <DialogDescription>
            {t(
              "Select one or more webinars and date options. No payment required.",
              "Vyberte jeden nebo více webinářů a termínů. Bez platby."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="order-name">{t("Name", "Jméno")} *</Label>
              <Input
                id="order-name"
                required
                placeholder={t("The name people call you", "Jméno, kterým vás lidé oslovují")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-gold/50"
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
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  const at = v.lastIndexOf("@");
                  if (at < 0) return;
                  const local = v.slice(0, at);
                  let domain = v.slice(at + 1);
                  if (!domain.includes(".")) {
                    domain = domain.replace(/([,l])([a-z]{2,24})$/i, ".$2");
                    setEmail(`${local}@${domain}`);
                  }
                }}
                className="border-gold/50"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">
              {t("Select webinars", "Vyberte webináře")} *
            </Label>
            <div className="max-h-48 overflow-y-auto rounded-md border border-input p-3 space-y-2">
              {[...allWebinars]
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((w) => (
                  <label
                    key={w.slug}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:opacity-80"
                  >
                    <Checkbox
                      checked={selectedSlugs.includes(w.slug)}
                      onCheckedChange={() => toggleSlug(w.slug)}
                    />
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
                  className={cn("w-full justify-start text-left font-normal", undecided && "opacity-50")}
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
              placeholder={t("e.g. mornings, 14:00, after 18:00", "např. dopoledne, 14:00, po 18:00")}
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              className="border-gold/50"
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
      </DialogContent>
    </Dialog>
  );
};
