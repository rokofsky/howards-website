import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SelectOption {
  label: string;
  value: string;
}

interface ContactFormProps {
  serviceName?: string;
  showServiceFields?: boolean;
}

const projectTypeOptions: SelectOption[] = [
  { value: "1-1-consultation", label: "1-1 consultation" },
  { value: "management-training", label: "Management training" },
  { value: "negotiation-mediation", label: "Negotiation mediation" },
  { value: "conflict-mediation", label: "Conflict mediation" },
  { value: "keynote-speaking", label: "Keynote speaking" },
];

const timelineOptions: SelectOption[] = [
  { value: "asap", label: "ASAP" },
  { value: "next-week", label: "Next week" },
  { value: "next-month", label: "Next month" },
  { value: "future", label: "In the future" },
];

const inputClasses = "w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow";

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
          <option value="" disabled hidden aria-hidden="true">{" "}</option>
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

const ContactForm = ({ serviceName, showServiceFields = false }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-lg p-10 text-center max-w-lg mx-auto"
      >
        <h3 className="text-2xl font-bold mb-3">You had me at "Send"</h3>
        <p className="text-muted-foreground font-normal">
          Howard will be in touch faster than you can say "synergy". Check your inbox tomorrow.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-lg p-8 md:p-10 max-w-2xl mx-auto space-y-5"
    >
      {serviceName && (
        <input type="hidden" name="service" value={serviceName} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="text-sm text-muted-foreground mb-1.5 block font-medium">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="The name people actually call you"
            value={form.name}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@bestemailever.com"
            value={form.email}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>
      </div>

      {showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="companyName" className="text-sm text-muted-foreground mb-1.5 block font-medium">Company Name</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Acme Inc."
              value={form.companyName}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="groupSize" className="text-sm text-muted-foreground mb-1.5 block font-medium">Estimated Group Size</label>
            <input
              id="groupSize"
              name="groupSize"
              type="text"
              placeholder="10-50 humans"
              value={form.groupSize}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="preferredDates" className="text-sm text-muted-foreground mb-1.5 block font-medium">Preferred Dates</label>
            <input
              id="preferredDates"
              name="preferredDates"
              type="date"
              value={form.preferredDates}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>
      )}

      {!showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <FormSelectField
            id="projectType"
            label="Project Type"
            name="projectType"
            onChange={handleChange}
            options={projectTypeOptions}
            placeholder="Select a project type"
            value={form.projectType}
          />
          <FormSelectField
            id="timeline"
            label="Timeline"
            name="timeline"
            onChange={handleChange}
            options={timelineOptions}
            placeholder="When do you need this"
            value={form.timeline}
          />
        </div>
      )}

      <div>
        <label htmlFor="message" className="text-sm text-muted-foreground mb-1.5 block font-medium">Message</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Tell me where it hurts."
          value={form.message}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow resize-none min-h-[100px]"
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
        <label htmlFor="copyToMe" className="text-sm text-muted-foreground font-normal">Send me a copy</label>
      </div>

      <Button variant="glass" size="xl" type="submit" className="w-full">
        Send Message
      </Button>
    </motion.form>
  );
};

export default ContactForm;
