import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Experts() {
  const [selectedExpert, setSelectedExpert] = useState<User | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: experts } = useQuery<User[]>({
    queryKey: ["/api/experts"],
  });

  const bookingMutation = useMutation({
    mutationFn: async ({
      expertId,
      date,
    }: {
      expertId: number;
      date: Date;
    }) => {
      const res = await apiRequest("POST", "/api/bookings", {
        expertId,
        date,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Fitness Experts</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experts?.map((expert) => (
          <Card key={expert.id}>
            <CardHeader>
              <CardTitle>{expert.username}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{expert.bio}</p>
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book a Session</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                    />
                    <Button
                      onClick={() => {
                        if (selectedExpert && date) {
                          bookingMutation.mutate({
                            expertId: selectedExpert.id,
                            date,
                          });
                        }
                      }}
                      disabled={bookingMutation.isPending}
                      className="w-full"
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
