import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowRight, Brain, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [, navigate] = useLocation();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Welcome to FitYog</h1>
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        <Card className="relative group cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/ai-assistant")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI Health Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Get personalized yoga and exercise recommendations from our AI assistant.
              Discover customized routines and expert guidance.
            </p>
            <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="relative group cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate("/dashboard")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="w-6 h-6" />
              Exercise Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Track your fitness journey, log exercises, and monitor your progress
              over time with detailed insights.
            </p>
            <Button variant="ghost" className="group-hover:translate-x-1 transition-transform">
              View Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}