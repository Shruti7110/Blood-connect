import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface HealthUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function HealthUpdateModal({ isOpen, onClose, patientId }: HealthUpdateModalProps) {
  const [hemoglobinLevel, setHemoglobinLevel] = useState<string>("");
  const [ironLevels, setIronLevels] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateHealthData = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('PUT', `/api/patients/${patientId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Health Data Updated",
        description: "Your health information has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      onClose();
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update health data. Please try again.",
      });
    },
  });

  const resetForm = () => {
    setHemoglobinLevel("");
    setIronLevels("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hemoglobinLevel && !ironLevels) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter at least one health metric.",
      });
      return;
    }

    const updateData: any = {};
    if (hemoglobinLevel) updateData.hemoglobinLevel = hemoglobinLevel;
    if (ironLevels) updateData.ironLevels = ironLevels;

    updateHealthData.mutate(updateData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Health Data</DialogTitle>
        </DialogHeader>
        
        <div className="mb-6">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-success">Update Your Health Metrics</p>
                <p className="text-sm text-gray-600">Keep your medical team informed</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
              <Input
                id="hemoglobin"
                value={hemoglobinLevel}
                onChange={(e) => setHemoglobinLevel(e.target.value)}
                placeholder="e.g., 9.2"
                type="text"
              />
            </div>
            
            <div>
              <Label htmlFor="iron">Iron Levels (ng/mL)</Label>
              <Input
                id="iron"
                value={ironLevels}
                onChange={(e) => setIronLevels(e.target.value)}
                placeholder="e.g., 850"
                type="text"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-success hover:bg-success/90"
                disabled={updateHealthData.isPending}
              >
                {updateHealthData.isPending ? "Updating..." : "Update Health Data"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
