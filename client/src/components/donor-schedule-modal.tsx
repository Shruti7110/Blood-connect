import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DonorScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  donorId: string;
}

export function DonorScheduleModal({
  isOpen,
  onClose,
  donorId,
}: DonorScheduleModalProps) {
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [location, setLocation] = useState<string>(
    "Manipal Hospital, Whitefield",
  );
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createDonation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/donations", data);
    },
    onSuccess: () => {
      toast({
        title: "Donation Scheduled",
        description:
          "Your donation has been scheduled successfully and will be allocated to connected patients.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transfusions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule donation. Please try again.",
      });
    },
  });

  const resetForm = () => {
    setScheduledDate("");
    setLocation("Manipal Hospital, Whitefield");
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

    createDonation.mutate({
      donorId: donorId,
      scheduledDate: new Date(scheduledDate).toISOString(),
      location,
      notes,
      unitsAvailable: 2,
      status: "scheduled",
    });
  };

  const [time, setTime] = useState<string>("09:00");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[500px]"
        aria-describedby="donor-schedule-description"
      >
        <DialogHeader>
          <DialogTitle>Schedule Donation</DialogTitle>
          <p id="donor-schedule-description" className="text-sm text-gray-600">
            Schedule your blood donation for a patient
          </p>
        </DialogHeader>

        <div className="mb-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-primary">
                  Schedule Blood Donation
                </p>
                <p className="text-sm text-gray-600">
                  Schedule your donation - it will be allocated to connected
                  patients automatically
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate.split("T")[0]}
                onChange={(e) => {
                  const time = scheduledDate.split("T")[1] || "09:00";
                  setScheduledDate(`${e.target.value}T${time}`);
                }}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>

            <div>
              <Label htmlFor="time">Time</Label>
              <Select
                value={time}
                onValueChange={(value) => {
                  setTime(value);
                  const date =
                    scheduledDate.split("T")[0] ||
                    new Date().toISOString().slice(0, 10);
                  setScheduledDate(`${date}T${value}`);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => {
                    const hour = (i + 9).toString().padStart(2, "0");
                    return ["00", "15", "30", "45"].map((minute, j) => (
                      <SelectItem
                        key={`${hour}:${minute}-${i}-${j}`}
                        value={`${hour}:${minute}`}
                      >
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
                  <SelectItem value="Manipal Hospital, Whitefield">
                    Manipal Hospital, Whitefield
                  </SelectItem>
                  <SelectItem value="Apollo Hospital, Bannerghatta Road">
                    Apollo Hospital, Bannerghatta Road
                  </SelectItem>
                  <SelectItem value="Fortis Hospital, Cunningham Road">
                    Fortis Hospital, Cunningham Road
                  </SelectItem>
                  <SelectItem value="Narayana Health, Electronic City">
                    Narayana Health, Electronic City
                  </SelectItem>
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
                placeholder="Any special instructions or availability notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createDonation.isPending}
              >
                {createDonation.isPending
                  ? "Scheduling..."
                  : "Schedule Donation"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
