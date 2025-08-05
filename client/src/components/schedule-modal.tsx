import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [time, setTime] = useState<string>("10:00");
  const [location, setLocation] = useState<string>("Manipal Hospital, Whitefield");
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
    setTime("10:00");
    setLocation("Manipal Hospital, Whitefield");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledDate || !time) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a date and time.",
      });
      return;
    }

    const dateTimeString = `${scheduledDate}T${time}:00`;
    createTransfusion.mutate({
      patientId,
      scheduledDate: new Date(dateTimeString).toISOString(),
      location,
      notes,
      unitsRequired: 2,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="schedule-description">
        <DialogHeader>
          <DialogTitle>Schedule Transfusion</DialogTitle>
          <p id="schedule-description" className="text-sm text-gray-600">Schedule your next blood transfusion appointment</p>
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
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => {
                    const hour = (i + 9).toString().padStart(2, '0');
                    return ['00', '15', '30', '45'].map(minute => (
                      <SelectItem key={`${hour}:${minute}`} value={`${hour}:${minute}`}>
                        {hour}:{minute}
                      </SelectItem>
                    ));
                  }).flat()}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Hospital</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manipal Hospital, Whitefield">Manipal Hospital, Whitefield</SelectItem>
                  <SelectItem value="Apollo Hospital, Bannerghatta Road">Apollo Hospital, Bannerghatta Road</SelectItem>
                  <SelectItem value="Narayana Health, Electronic City">Narayana Health, Electronic City</SelectItem>
                </SelectContent>
              </Select>
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