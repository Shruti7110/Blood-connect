import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function ScheduleModal({ isOpen, onClose, patientId }: ScheduleModalProps) {
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [location, setLocation] = useState<string>("St. Mary's Hospital - Room 304");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTransfusion = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/transfusions', data);
    },
    onSuccess: () => {
      toast({
        title: "Transfusion Scheduled",
        description: "Your transfusion has been scheduled and donor notifications have been sent.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/transfusions'] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule transfusion. Please try again.",
      });
    },
  });

  const resetForm = () => {
    setScheduledDate("");
    setLocation("St. Mary's Hospital - Room 304");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time.",
      });
      return;
    }

    createTransfusion.mutate({
      patientId,
      scheduledDate: new Date(scheduledDate).toISOString(),
      location,
      notes,
      unitsRequired: 2,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Transfusion</DialogTitle>
          <p className="text-sm text-gray-600">Schedule your next blood transfusion appointment</p>
        </DialogHeader>

        <div className="mb-6">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-secondary">Schedule New Transfusion</p>
                <p className="text-sm text-gray-600">Your donor family will be notified</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date and Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Hospital and room number"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special instructions..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createTransfusion.isPending}
              >
                {createTransfusion.isPending ? "Scheduling..." : "Schedule Transfusion"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}