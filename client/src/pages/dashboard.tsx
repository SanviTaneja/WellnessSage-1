import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Exercise, insertExerciseSchema } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
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

export default function Dashboard() {
  const { user } = useAuth();
  const [aiResponse, setAiResponse] = useState<AIChatResponse | null>(null);

  const form = useForm({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      type: "",
      duration: 0,
      calories: 0,
    },
  });

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const exerciseMutation = useMutation({
    mutationFn: async (data: Exercise) => {
      const res = await apiRequest("POST", "/api/exercises", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      form.reset();
    },
  });

  const aiMutation = useMutation({
    mutationFn: getAIRecommendations,
    onSuccess: (data) => {
      setAiResponse(data);
    },
  });

  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Track Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => exerciseMutation.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exercise Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Burned</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={exerciseMutation.isPending}>
                Log Exercise
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>AI Health Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="Describe your fitness goals or health concerns..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
            >
              Clear
            </Button>
          </div>

          {aiMutation.isPending && (
            <div className="text-center py-4 text-muted-foreground">
              Analyzing your request...
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

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Exercise History</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {exercises?.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{exercise.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(exercise.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>{exercise.duration} minutes</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.calories} calories
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}