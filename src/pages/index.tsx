import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import AddToCombo from "@/components/AddToCombo";
import Gallery from "@/components/Gallery";
import HowItWorks from "@/components/HowItWorks";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ChatSupport from "@/components/ChatSupport";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Products />
        <AddToCombo />
        <Gallery />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
      <ChatSupport />
    </div>
  );
};

export default Index;