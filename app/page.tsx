import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { ProblemSolution } from "@/components/ProblemSolution";
import { Walkthrough } from "@/components/Walkthrough";
import { VideoCard } from "@/components/VideoCard";
import { Presets } from "@/components/Presets";
import { Specs } from "@/components/Specs";
import { Customization } from "@/components/Customization";
import { MiniEstimator } from "@/components/MiniEstimator";
import { ChecklistBuilder } from "@/components/ChecklistBuilder";
import { LineSection } from "@/components/LineSection";
import { FAQ } from "@/components/FAQ";
import { ContactForm } from "@/components/ContactForm";
import { SalesforceScript } from "@/components/SalesforceScript";
import { DemoSection } from "@/components/DemoSection";

export default function Home() {
  return (
    <main className="bg-bg text-text min-h-screen selection:bg-accent selection:text-white">
      <Header />
      
      <Hero />
      
      <ProblemSolution />
      
      <Walkthrough />
      
      <Presets />

      <section className="py-24 bg-surface/50">
        <div className="container-custom">
           <h2 className="text-3xl font-bold mb-12 text-center">実際の導入イメージ</h2>
           <VideoCard />
        </div>
      </section>

      <DemoSection />

      <Specs />
      
      <Customization />

      <MiniEstimator />

      <LineSection />

      <ChecklistBuilder />

      <FAQ />

      <ContactForm />
      
      <Footer />
      <MobileStickyCTA />
      
      <SalesforceScript />
    </main>
  );
}
