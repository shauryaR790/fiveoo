import Navbar from "@/components/Navbar";
import HeroAboutBand from "@/components/HeroAboutBand";
import Works from "@/components/Works";
import Branding from "@/components/Branding";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main id="main" className="relative">
      <Navbar />
      <HeroAboutBand />
      <Works />
      <Branding />
      <Services />
      <Pricing />
      <Process />
      <Partners />
      <Testimonials />
      <Footer />
    </main>
  );
}
