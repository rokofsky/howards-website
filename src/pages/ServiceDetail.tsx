import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ContactForm from "@/components/ContactForm";
import { services } from "@/data/services";
import { motion } from "framer-motion";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <Layout>
        <div className="section-padding pt-24 text-center">
          <h1 className="text-3xl font-bold">Service not found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding pt-24">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">{service.title}</h1>
            <p className="text-xl text-muted-foreground font-light italic mb-8">{service.hook}</p>

            <div className="glass rounded-lg p-8 mb-12">
              <h3 className="text-xl font-semibold mb-4">About This Service</h3>
              <p className="text-foreground/80 font-light leading-relaxed mb-4">
                Howard brings his signature blend of storytelling, practical frameworks, and just enough humor to keep everyone awake. This service is tailored to your team's specific needs, challenges, and goals.
              </p>
              <p className="text-foreground/80 font-light leading-relaxed">
                Every engagement starts with a brief discovery call to understand your context. From there, Howard designs a custom experience that delivers measurable improvements in how your team communicates, collaborates, and leads.
              </p>
            </div>
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-center mb-2">Inquire About {service.title}</h2>
            <p className="text-muted-foreground font-light text-center mb-8">
              Fill in the details below and Howard will get back to you with a custom proposal.
            </p>
            <ContactForm serviceName={service.title} showServiceFields />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
