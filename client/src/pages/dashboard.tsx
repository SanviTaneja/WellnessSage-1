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
import { getAIRecommendations } from "@/lib/openai";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const [aiResponse, setAiResponse] = useState("");

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
      setAiResponse(data.message);
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

      <Card>
        <CardHeader>
          <CardTitle>AI Assistant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Ask for exercise recommendations..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                aiMutation.mutate(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
          <ScrollArea className="h-[300px] rounded-md border p-4">
            {aiResponse && <p className="text-sm">{aiResponse}</p>}
          </ScrollArea>
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
