import Layout from "@/components/Layout";

const PrivacyPolicy = () => (
  <Layout>
    <section className="section-padding max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: 11 April 2026</p>

      <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Who We Are</h2>
          <p>Rokofsky Communication Training provides professional consulting, facilitation, and coaching services. Our registered address is in Prague, 17000 Czech Republic. For questions about this policy, contact us at info@rokofsky.com.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Information We Collect</h2>
          <p>We may collect the following personal data:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Name and email address (via contact forms or event registrations), although we will never save your name or email address for any other purpose.</li>
            <li>Company name and role</li>
            <li>Messages and enquiry details you submit</li>
            <li>Technical data such as IP address, browser type, and pages visited (via cookies and analytics)</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To respond to enquiries and provide our services</li>
            <li>To send event confirmations and relevant follow-ups</li>
            <li>To improve our website and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Legal Basis for Processing</h2>
          <p>We process personal data based on: (a) your consent, (b) the performance of a contract, or (c) our legitimate business interests, provided these do not override your rights.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Data Sharing</h2>
          <p>We do not sell your personal data. We may share information ONLY with trusted service providers (e.g., hosting, email delivery, video conferencing) who process data on our behalf under strict confidentiality agreements. Nothing else.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Data Retention</h2>
          <p>We retain personal data only as long as necessary for the purposes described above, or as required by law. You may request deletion at any time by contacting info@rokofsky.com.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Your Rights</h2>
          <p>You have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact info@rokofsky.com.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. Cookies</h2>
          <p>Our website uses cookies to enhance your experience and analyse traffic. You can manage cookie preferences through your browser settings.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Changes to This Policy</h2>
          <p>We may update this policy from time to time, although probably not. Changes will be posted on this page with an updated revision date.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default PrivacyPolicy;
