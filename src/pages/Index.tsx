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
          <p className="text-muted-foreground font-light max-w-md mx-auto">
            Whether it's a quick question or a grand plan — Howard reads every message. Eventually.
          </p>
        </div>
        <ContactForm />
        <div className="text-center mt-8">
          <Button variant="glassPetrol" size="lg" asChild>
            <a href="#booking">Skip the email, book a call now</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
