import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function EmergencyModal({ isOpen, onClose, patientId }: EmergencyModalProps) {
  const [urgencyLevel, setUrgencyLevel] = useState<string>("");
  const [unitsNeeded, setUnitsNeeded] = useState<string>("2");
  const [notes, setNotes] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createEmergencyRequest = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/emergency-requests', data);
    },
    onSuccess: () => {
      toast({
        title: "Emergency Request Sent",
        description: "Your emergency blood request has been sent to your donor family and local blood banks.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/emergency-requests'] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send emergency request. Please try again.",
      });
    },
  });

  const resetForm = () => {
    setUrgencyLevel("");
    setUnitsNeeded("2");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urgencyLevel) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an urgency level.",
      });
      return;
    }

    createEmergencyRequest.mutate({
      patientId,
      urgencyLevel,
      unitsNeeded: parseInt(unitsNeeded),
      notes,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Emergency Blood Request</DialogTitle>
          <p className="text-sm text-gray-600">Submit an urgent request for blood transfusion</p>
        </DialogHeader>

        <div className="mb-6">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-secondary">Urgent Blood Needed</p>
                <p className="text-sm text-gray-600">Blood Type: B+ Required</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="critical">Critical (within 24 hours)</SelectItem>
                  <SelectItem value="high">High (within 48 hours)</SelectItem>
                  <SelectItem value="medium">Medium (within 72 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="units">Units Needed</Label>
              <Input
                id="units"
                type="number"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(e.target.value)}
                min="1"
                max="4"
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special requirements or medical notes..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-secondary hover:bg-secondary/90"
                disabled={createEmergencyRequest.isPending}
              >
                {createEmergencyRequest.isPending ? "Sending..." : "Send Emergency Request"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}