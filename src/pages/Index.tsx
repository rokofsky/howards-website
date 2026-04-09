import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import SubHeroNav from "@/components/SubHeroNav";
import ServicesGrid from "@/components/ServicesGrid";
import BlogPreview from "@/components/BlogPreview";
import VideoShowcase from "@/components/VideoShowcase";
import ContactForm from "@/components/ContactForm";
import BookingSection from "@/components/BookingSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { openCalendly } from "@/lib/calendly";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <SubHeroNav />
      <ServicesGrid />
      <FAQSection />
      <PricingSection />
      <BlogPreview />
      <VideoShowcase />
      <BookingSection />

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Let's Talk</h2>
          <p className="max-w-md mx-auto font-medium text-primary">
            Whether you've got a quick question or grand plan, I read and reply to every personal message by next day.
          </p>
        </div>
        <ContactForm />
        <div className="text-center mt-8">
          <Button variant="glassPetrol" size="lg" onClick={openCalendly}>
            Skip the email, book a call now
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
