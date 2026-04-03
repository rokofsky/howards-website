import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ContactFormProps {
  serviceName?: string;
  showServiceFields?: boolean;
}

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
        <h3 className="text-2xl font-bold mb-3">You had me at "submit."</h3>
        <p className="text-muted-foreground font-light">
          Howard will be in touch faster than you can say "synergy" — and with considerably more substance. Check your inbox soon.
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
          <label htmlFor="name" className="text-sm font-light text-muted-foreground mb-1.5 block">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="The name people actually call you"
            value={form.name}
            onChange={handleChange}
            className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-light text-muted-foreground mb-1.5 block">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@bestemailever.com"
            value={form.email}
            onChange={handleChange}
            className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
          />
        </div>
      </div>

      {showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="companyName" className="text-sm font-light text-muted-foreground mb-1.5 block">Company Name</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Acme Inc."
              value={form.companyName}
              onChange={handleChange}
              className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="groupSize" className="text-sm font-light text-muted-foreground mb-1.5 block">Estimated Group Size</label>
            <input
              id="groupSize"
              name="groupSize"
              type="text"
              placeholder="10-50 humans"
              value={form.groupSize}
              onChange={handleChange}
              className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="preferredDates" className="text-sm font-light text-muted-foreground mb-1.5 block">Preferred Dates</label>
            <input
              id="preferredDates"
              name="preferredDates"
              type="date"
              value={form.preferredDates}
              onChange={handleChange}
              className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
            />
          </div>
        </div>
      )}

      {!showServiceFields && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="projectType" className="text-sm font-light text-muted-foreground mb-1.5 block">Project Type</label>
            <select
              id="projectType"
              name="projectType"
              value={form.projectType}
              onChange={handleChange}
              className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
            >
              <option value="">Select a project type</option>
              <option value="consultation">1-1 Consultation</option>
              <option value="management-training">Management Training</option>
              <option value="negotiation-mediation">Negotiation Mediation</option>
              <option value="conflict-mediation">Conflict Mediation</option>
              <option value="keynote-speaking">Keynote Speaking</option>
            </select>
          </div>
          <div>
            <label htmlFor="timeline" className="text-sm font-light text-muted-foreground mb-1.5 block">Timeline</label>
            <select
              id="timeline"
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              className="w-full h-12 md:h-11 px-4 rounded-md bg-background border border-input text-foreground text-sm font-light focus:outline-none focus:ring-2 focus:ring-gold/30 transition-shadow"
            >
              <option value="">When do you need this?</option>
              <option value="asap">ASAP</option>
              <option value="next-week">Next week</option>
              <option value="next-month">Next month</option>
              <option value="future">In the future</option>
            </select>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="message" className="text-sm font-light text-muted-foreground mb-1.5 block">Message</label>
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
        <label htmlFor="copyToMe" className="text-sm font-light text-muted-foreground">Send me a copy</label>
      </div>

      <Button variant="glass" size="xl" type="submit" className="w-full">
        Send Message
      </Button>
    </motion.form>
  );
};

export default ContactForm;
