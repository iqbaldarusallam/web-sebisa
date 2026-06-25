import About from "@/components/About";
import BTSSection from "@/components/BTSSection";
import ClientLogos from "@/components/ClientLogos";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import Workflow from "@/components/Workflow";
import { getPublicCmsContent } from "@/lib/public/cms";

export default async function Home() {
  const cms = await getPublicCmsContent();

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <Hero />
      <ClientLogos items={cms.clients} />
      <About />
      <Services items={cms.services} />
      <WhyChooseUs />
      <Workflow />
      <Testimonials items={cms.testimonials} />
      <CTA />
      <BTSSection items={cms.bts.slice(0, 4)} />
      <Portfolio items={cms.portfolio} />
      <Contact />
      <Footer />
    </main>
  );
}
