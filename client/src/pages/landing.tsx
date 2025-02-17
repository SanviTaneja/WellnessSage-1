import { ArrowRight, Brain, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto p-6 space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Your Personal AI-Powered Fitness Journey
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          FitYog combines artificial intelligence with expert guidance to create 
          a personalized wellness experience tailored just for you.
        </p>
      </section>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        <div 
          className="relative group cursor-pointer hover:shadow-lg transition-shadow p-6 rounded-lg border"
          onClick={() => navigate("/ai-assistant")}
        >
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">AI Assistant</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Get personalized yoga and exercise recommendations from our AI assistant.
            Discover customized routines and expert guidance.
          </p>
          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
            Start Now <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div 
          className="relative group cursor-pointer hover:shadow-lg transition-shadow p-6 rounded-lg border"
          onClick={() => navigate("/dashboard")}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Track Progress</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Monitor your fitness journey with detailed insights. Log exercises, track progress,
            and achieve your wellness goals.
          </p>
          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
            View Dashboard <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

        <div 
          className="relative group cursor-pointer hover:shadow-lg transition-shadow p-6 rounded-lg border"
          onClick={() => navigate("/experts")}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Expert Guidance</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Connect with professional fitness trainers and yoga experts.
            Book personalized sessions and get direct guidance.
          </p>
          <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
            Meet Experts <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* About Section */}
      <section className="max-w-4xl mx-auto text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold">About FitYog</h2>
        <p className="text-lg text-muted-foreground">
          FitYog is an innovative platform that brings together the ancient wisdom of yoga
          with modern artificial intelligence. Our mission is to make personalized fitness
          and wellness accessible to everyone, regardless of their experience level.
        </p>
        <div 
          className="aspect-video rounded-lg overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1599447292325-2cffaa79bcbb")',
          }}
        />
      </section>
    </div>
  );
}