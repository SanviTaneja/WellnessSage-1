import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Booking } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  date: z.date(),
  time: z.string().min(1, "Please select a time"),
  contactInfo: z.string().min(1, "Contact information is required"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function Experts() {
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      time: "",
      contactInfo: "",
    },
  });

  const { data: experts } = useQuery<User[]>({
    queryKey: ["/api/experts"],
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData & { expertId: number }) => {
      const res = await apiRequest("POST", "/api/bookings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Session Booked",
        description: "Your session has been successfully scheduled.",
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fitness Experts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts?.map((expert) => (
          <Card key={expert.id} className="overflow-hidden">
            <div 
              className="w-full h-48 bg-cover bg-center"
              style={{
                backgroundImage: expert.photoUrl 
                  ? `url(${expert.photoUrl})` 
                  : 'url("https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b")'
              }}
            />
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{expert.username}</CardTitle>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-primary text-primary" />
                  <span className="text-sm">{expert.rating || 4.5}/5</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{expert.experience || "5+ years experience"}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{expert.bio}</p>
              <div className="flex flex-wrap gap-2">
                {expert.specialties?.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setSelectedExpert(expert)}
                    className="w-full"
                  >
                    Book Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Book a Session with {expert.username}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form 
                      onSubmit={form.handleSubmit((data) => {
                        if (selectedExpert) {
                          bookingMutation.mutate({
                            ...data,
                            expertId: selectedExpert.id,
                          });
                        }
                      })}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Date</FormLabel>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              className="rounded-md border"
                              disabled={(date) => date < new Date()}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="contactInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Information</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Phone number or email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={bookingMutation.isPending}
                      >
                        Confirm Booking
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}