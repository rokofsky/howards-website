import Layout from "@/components/Layout";

const TermsOfService = () => (
  <Layout>
    <section className="section-padding max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms of Service</h1>
      <p className="text-muted-foreground text-sm mb-10">Last updated: [DATE]</p>

      <div className="space-y-8 text-foreground/80 font-light leading-relaxed text-[15px]">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Overview</h2>
          <p>These Terms of Service ("Terms") govern your use of the website and services provided by [BUSINESS NAME] ("we", "us", "our"). By accessing our website or engaging our services, you agree to these Terms.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Services</h2>
          <p>We provide professional consulting, facilitation, coaching, and training services in the areas of communication, storytelling, meeting moderation, and related soft skills. The specific scope, deliverables, and fees for any engagement will be agreed upon in a separate proposal or contract.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Intellectual Property</h2>
          <p>All content on this website — including text, graphics, logos, and media — is the property of [BUSINESS NAME] and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Booking &amp; Cancellation</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bookings are confirmed upon written agreement or receipt of a deposit, where applicable.</li>
            <li>Cancellations made more than [NUMBER] business days before the scheduled date will receive a full refund.</li>
            <li>Cancellations made within [NUMBER] business days may incur a cancellation fee of up to [PERCENTAGE]% of the agreed fee.</li>
            <li>We reserve the right to reschedule or cancel sessions due to unforeseen circumstances, in which case a full refund or alternative date will be offered.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Confidentiality</h2>
          <p>We treat all client information as confidential. Details shared during consulting engagements, workshops, or coaching sessions will not be disclosed to third parties without your explicit consent, except where required by law.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Limitation of Liability</h2>
          <p>[BUSINESS NAME] provides services on an "as-is" basis. While we strive for the highest quality, we do not guarantee specific outcomes. Our total liability for any claim arising from our services shall not exceed the fees paid for the specific engagement in question.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Website Use</h2>
          <p>You agree to use this website for lawful purposes only. You may not attempt to gain unauthorised access to any part of the website, its server, or any connected systems.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">8. External Links</h2>
          <p>Our website may contain links to third-party websites. We are not responsible for the content or privacy practices of these external sites.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">9. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of [JURISDICTION]. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of [JURISDICTION].</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">10. Changes to These Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page with a revised date. Continued use of our website or services constitutes acceptance of the updated Terms.</p>
        </div>
      </div>
    </section>
  </Layout>
);

export default TermsOfService;
