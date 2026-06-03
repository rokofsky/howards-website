import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useT } from "@/hooks/useT";
import { useIsCzech } from "@/hooks/useLanguageRouting";
import { trackCTA } from "@/lib/analytics";

interface SelectOption {
  label: string;
  value: string;
}

interface ContactFormProps {
  serviceName?: string;
  showServiceFields?: boolean;
  formKind?: "general" | "service" | "webinar";
}

const projectTypeOptions: SelectOption[] = [
  { value: "1-1-consultation", label: "1-1 consultation" },
  { value: "management-training", label: "Management training" },
  { value: "negotiation-mediation", label: "Negotiation mediation" },
  { value: "conflict-mediation", label: "Conflict mediation" },
  { value: "keynote-speaking", label: "Keynote speaking" },
];

const preferredDatesOptions: SelectOption[] = [
  { value: "asap", label: "ASAP" },
  { value: "next-week", label: "Next week" },
  { value: "near-future", label: "Near future" },
];

const timelineOptions: SelectOption[] = [
  { value: "asap", label: "ASAP" },
  { value: "next-week", label: "Next week" },
  { value: "next-month", label: "Next month" },
  { value: "future", label: "In the future" },
];

const inputClasses = "w-full h-12 md:h-11 px-4 rounded-md bg-background border border-gold/40 text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow";

const scrollIntoViewOnFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const target = e.target;
  setTimeout(() => {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 300);
};

// Fix common mobile typos: comma or lowercase 'l' immediately before the TLD.
// Returns a fixed email only if the original fails standard validation and the fix passes.
export const fixCommonEmailTypos = (email: string): string => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (re.test(email)) return email;
  const fixed = email.replace(/[,l](?=[a-zA-Z]{2,24}$)/, ".");
  return re.test(fixed) ? fixed : email;
};

const FormSelectField = ({
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
}: {
  id: string;
  label: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder: string;
  value: string;
}) => {
  return (
    <div>
      <label htmlFor={id} className="text-sm text-muted-foreground mb-1.5 block font-medium">{label}</label>
      <div className="relative">
        {!value && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-sm font-light text-muted-foreground/70">
            {placeholder}
          </span>
        )}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          className={`${inputClasses} appearance-none pr-10 ${value ? "text-foreground" : "text-transparent"}`}
        >
          <option value="" disabled hidden>{" "}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} style={{ color: "#000", letterSpacing: "normal", wordSpacing: "normal" }}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground">
          ▾
        </span>
      </div>
    </div>
  );
};

const ContactForm = ({ serviceName, showServiceFields = false, formKind }: ContactFormProps) => {
  const t = useT();
  const isCz = useIsCzech();
  const resolvedFormKind: "general" | "service" | "webinar" =
    formKind ?? (showServiceFields ? "service" : "general");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
    projectType: "",
    timeline: "",
    companyName: "",
    groupSize: "",
    preferredDates: "",
    copyToMe: false,
  });
  const [website, setWebsite] = useState(""); // honeypot
  const formOpenedAt = useRef<number>(Date.now());
  useEffect(() => { formOpenedAt.current = Date.now(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bot defense 1: honeypot — if filled, silently "succeed" without sending
    if (website.trim() !== "") {
      setSubmitted(true);
      return;
    }
    // Lenient email fix for common mobile typos
    const fixedEmail = fixCommonEmailTypos(form.email.trim());
    if (fixedEmail !== form.email) {
      setForm((prev) => ({ ...prev, email: fixedEmail }));
    }

    // Bot defense 2: time trap — must be open >3s
    const elapsed = Date.now() - formOpenedAt.current;
    if (elapsed < 3000) {
      toast({
        title: t("Just a moment", "Okamžik prosím"),
        description: t("Please take a moment to review your message.", "Věnujte prosím chvíli kontrole zprávy."),
      });
      return;
    }

    setLoading(true);
    try {
      const emailPayload = {
        name: form.name,
        email: fixedEmail,
        message: form.message,
        service: serviceName || "",
        companyName: form.companyName,
        groupSize: form.groupSize,
        preferredDates: form.preferredDates,
        projectType: form.projectType,
        timeline: form.timeline,
        copyToMe: form.copyToMe,
        website, // honeypot (empty)
        elapsedMs: elapsed,
        locale: isCz ? "cs" : "en",
        formKind: resolvedFormKind,
      };

      const { error: notifError } = await supabase.functions.invoke("send-contact-email", {
        body: emailPayload,
      });

      if (notifError) {
        console.error("Notification email error:", notifError);
      }

      setSubmitted(true);
      trackCTA("contact_form_submit", { service: serviceName || "general" });
    } catch (err) {
      console.error("Submit error:", err);
      toast({
        title: t("Something went wrong", "Něco se pokazilo"),
        description: t(
          "Please try again or email info@rokofsky.com directly.",
          "Zkuste to prosím znovu nebo napište přímo na info@rokofsky.com."
        ),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-lg p-6 max-w-lg mx-auto"
      >
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold mb-3">
            {t("Thanks for the nudge", "Díky za připomenutí")}
          </h3>
          <p className="text-muted-foreground font-normal">
            {t(
              'Howard will be in touch faster than you can say "synergy". Check your email tomorrow.',
              'Howard se ozve dřív, než stačíte říct „synergie“. Zítra se podívejte na e-mail.'
            )}
          </p>
        </div>
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSubmitted(false);
              setForm({
                name: "",
                email: "",
                message: "",
                projectType: "",
                timeline: "",
                companyName: "",
                groupSize: "",
                preferredDates: "",
                copyToMe: false,
              });
            }}
          >
            {t("Say something more", "Říct něco dalšího")}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-lg p-8 md:p-10 max-w-2xl mx-auto space-y-5"
    >
      {serviceName && (
        <input type="hidden" name="service" value={serviceName} />
      )}

      {/* Honeypot — must remain empty. Hidden from users & screen readers. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm text-muted-foreground mb-1.5 block font-medium">
            {t("Name", "Jméno")} <span className="text-gold">* {t("(required)", "(povinné)")}</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder={t("The name people call you", "Jméno, kterým vás lidé oslovují")}
            value={form.name}
            onChange={handleChange}
            onFocus={scrollIntoViewOnFocus}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-muted-foreground mb-1.5 block font-medium">
            {t("Email", "Email")} <span className="text-gold">* {t("(required)", "(povinné)")}</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@bestemail.com"
            value={form.email}
            onChange={handleChange}
            onFocus={scrollIntoViewOnFocus}
            className={inputClasses}
          />
        </div>
      </div>

      {showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="companyName" className="text-sm text-muted-foreground mb-1.5 block font-medium">
              {t("Company Name", "Název společnosti")}
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Apple"
              value={form.companyName}
              onChange={handleChange}
              onFocus={scrollIntoViewOnFocus}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="groupSize" className="text-sm text-muted-foreground mb-1.5 block font-medium">
              {t("Estimated Group Size", "Předpokládaná velikost skupiny")}
            </label>
            <input
              id="groupSize"
              name="groupSize"
              type="text"
              placeholder={t("10-50 humans", "10–50 lidí")}
              value={form.groupSize}
              onChange={handleChange}
              onFocus={scrollIntoViewOnFocus}
              className={inputClasses}
            />
          </div>
          <FormSelectField
            id="preferredDates"
            label={t("Preferred Dates", "Preferované termíny")}
            name="preferredDates"
            onChange={handleChange}
            options={preferredDatesOptions}
            placeholder={t("When you need this", "Kdy to potřebujete")}
            value={form.preferredDates}
          />
        </div>
      )}

      {!showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormSelectField
            id="projectType"
            label={t("Project Type", "Typ projektu")}
            name="projectType"
            onChange={handleChange}
            options={projectTypeOptions}
            placeholder={t("Select a project type", "Vyberte typ projektu")}
            value={form.projectType}
          />
          <FormSelectField
            id="timeline"
            label={t("Timeline", "Časový plán")}
            name="timeline"
            onChange={handleChange}
            options={timelineOptions}
            placeholder={t("When do you need this", "Kdy to potřebujete")}
            value={form.timeline}
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="text-sm text-muted-foreground mb-1.5 block font-medium">
          {t("Message", "Zpráva")} <span className="text-gold">* {t("(required)", "(povinné)")}</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder={t("Tell me where it hurts.", "Řekněte mi, kde vás tlačí bota.")}
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-background border border-gold/40 text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow resize-none min-h-[100px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="copyToMe"
          name="copyToMe"
          checked={form.copyToMe}
          onChange={handleChange}
          className="w-5 h-5 rounded border-input accent-gold"
        />
        <label htmlFor="copyToMe" className="text-sm text-muted-foreground font-normal">
          {t("Send me a copy", "Pošlete mi kopii")}
        </label>
      </div>

      <Button variant="glass" size="xl" type="submit" className="w-full" disabled={loading}>
        {loading
          ? t("Sending...", "Odesílám...")
          : t("Send Message", "Odeslat zprávu")}
      </Button>
    </motion.form>
  );
};

export default ContactForm;
