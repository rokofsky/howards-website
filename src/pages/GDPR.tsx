import Layout from "@/components/Layout";

const GDPR = () => (
  <Layout>
    <section className="section-padding max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">GDPR &amp; Data Protection</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: 14.04.2026</p>

      <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Data Controller</h2>
          <p>Rokofsky Events s.r.o. acts as the data controller for personal data collected through this website. Registered address: Simackova 24, Prague, CZ. Data protection contact: info@rokofsky.com</p>
        </div>
        <div>
...
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Data Subject Rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification</strong> — Request correction of inaccurate data.</li>
            <li><strong>Erasure</strong> — Request deletion of your data ("right to be forgotten").</li>
            <li><strong>Restriction</strong> — Request limitation of processing in certain circumstances.</li>
            <li><strong>Portability</strong> — Receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection</strong> — Object to processing based on legitimate interests or direct marketing.</li>
          </ul>
          <p className="mt-2">To exercise any of these rights, contact us at info@rokofsky.com. We will respond within 30 days.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. International Data Transfers</h2>
          <p>Where data is transferred outside the EU/EEA (e.g., to service providers in the United States), we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect personal data against unauthorised access, alteration, disclosure, or destruction. These include encryption, access controls, and regular security assessments.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Data Breach Notification</h2>
          <p>In the event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours and inform affected individuals without undue delay.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Third-Party Processors</h2>
          <p>We use the following categories of third-party processors:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Website hosting and infrastructure</li>
            <li>Email delivery services</li>
            <li>Video conferencing platforms</li>
            <li>Analytics tools</li>
          </ul>
          <p className="mt-2">All processors are bound by data processing agreements in compliance with GDPR Article 28.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Supervisory Authority</h2>
          <p>If you believe your data protection rights have been violated, you have the right to lodge a complaint with your local supervisory authority. A list of EU data protection authorities can be found at <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent/80">edpb.europa.eu</a>.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default GDPR;
