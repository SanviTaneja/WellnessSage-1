import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { getAIRecommendations, type AIChatResponse } from "@/lib/openai";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AIAssistant() {
  const [aiResponse, setAiResponse] = useState<AIChatResponse | null>(null);
  const { toast } = useToast();

  const aiMutation = useMutation({
    mutationFn: getAIRecommendations,
    onSuccess: (data) => {
      setAiResponse(data);
    },
    onError: (error: Error) => {
      toast({
        title: "AI Assistant Error",
        description: error.message || "Failed to get AI recommendations. Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>AI Health Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Describe your fitness goals or health concerns..."
              disabled={aiMutation.isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.currentTarget.value.trim()) {
                  aiMutation.mutate(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
            <Button
              variant="outline"
              onClick={() => {
                setAiResponse(null);
              }}
              disabled={aiMutation.isPending}
            >
              Clear
            </Button>
          </div>

          {aiMutation.isPending && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Analyzing your request...
                </p>
              </div>
            </div>
          )}

          {aiMutation.isError && (
            <div className="text-center py-4 text-destructive">
              <p className="text-sm">
                Unable to process your request at the moment. Please try again later.
              </p>
            </div>
          )}

          {aiResponse && (
            <ScrollArea className="h-[600px] rounded-md border p-4">
              <div className="space-y-6">
                <p className="text-sm">{aiResponse.message}</p>

                <Tabs defaultValue="asanas">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="asanas">Asanas</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="asanas">
                    <Accordion type="single" collapsible className="w-full">
                      {aiResponse.asanas.map((asana, index) => (
                        <AccordionItem key={index} value={`asana-${index}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span>{asana.name}</span>
                              <Badge variant="outline">{asana.difficulty}</Badge>
                              <Badge variant="secondary">
                                {asana.duration}min
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-2">
                            <div>
                              <h4 className="font-semibold mb-1">Benefits:</h4>
                              <ul className="list-disc pl-4">
                                {asana.benefits.map((benefit, i) => (
                                  <li key={i} className="text-sm">
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Instructions:</h4>
                              <ol className="list-decimal pl-4">
                                {asana.instructions.map((instruction, i) => (
                                  <li key={i} className="text-sm">
                                    {instruction}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="exercises">
                    <Accordion type="single" collapsible className="w-full">
                      {aiResponse.exercises.map((exercise, index) => (
                        <AccordionItem key={index} value={`exercise-${index}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <span>{exercise.name}</span>
                              <Badge variant="outline">
                                {exercise.difficulty}
                              </Badge>
                              <Badge variant="secondary">
                                {exercise.duration}min
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-2">
                            <div>
                              <h4 className="font-semibold mb-1">Benefits:</h4>
                              <ul className="list-disc pl-4">
                                {exercise.benefits.map((benefit, i) => (
                                  <li key={i} className="text-sm">
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">Instructions:</h4>
                              <ol className="list-decimal pl-4">
                                {exercise.instructions.map((instruction, i) => (
                                  <li key={i} className="text-sm">
                                    {instruction}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>

                  <TabsContent value="resources">
                    <div className="space-y-4">
                      {aiResponse.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{resource.title}</h3>
                            <Badge>{resource.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
