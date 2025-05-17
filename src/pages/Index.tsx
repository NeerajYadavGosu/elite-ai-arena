
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LogoMarquee from "@/components/LogoMarquee";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="flex flex-col items-center text-center gap-4 md:gap-8">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight gradient-text mb-4">
              Elite Builder AI
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Build. Compete. Get Discovered.
            </h2>
            <p className="text-xl text-muted-foreground max-w-[700px]">
              Join AI-powered hackathons judged by both humans and LLMs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="gradient-bg">
                <Link to="/challenges">Start Building</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Sponsors Section */}
        <section className="w-full">
          <div className="container mx-auto px-4 py-8 text-center">
            <h3 className="text-lg font-medium text-muted-foreground mb-4">
              Trusted by leading companies in AI and tech
            </h3>
          </div>
          <LogoMarquee />
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4 text-white font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Find a Challenge</h3>
              <p className="text-muted-foreground">Explore challenges posted by top tech companies looking for innovative solutions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4 text-white font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Build Your Solution</h3>
              <p className="text-muted-foreground">Submit your app, API, or prototype with a GitHub repo and demo video.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4 text-white font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Get Recognition</h3>
              <p className="text-muted-foreground">Win prizes, get noticed by recruiters, and showcase your skills to the world.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="gradient-bg py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to showcase your skills?</h2>
            <p className="text-white/80 text-xl mb-8 max-w-[700px] mx-auto">
              Join thousands of developers building the next generation of AI-powered applications.
            </p>
            <Button asChild size="lg" variant="secondary" className="bg-white text-elite-primary hover:bg-white/90">
              <Link to="/challenges">Explore Challenges</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
