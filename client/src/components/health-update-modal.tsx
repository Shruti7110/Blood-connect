import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface HealthUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
}

export function HealthUpdateModal({ isOpen, onClose, patientId }: HealthUpdateModalProps) {
  const [formData, setFormData] = useState({
    hemoglobinLevel: "",
    ironLevels: "",
    weight: "",
    symptoms: "",
    chelationMedication: "",
    chelationFrequency: "",
    lastSerumFerritin: "",
    adverseReactions: "",
    diagnosis: "",
    thalassemiaType: "",
    ironChelationTherapy: "",
    recentPreTransfusionHb: "",
    usualTransfusionHbLevel: "",
    unitsPerSession: "",
    lastLiverIronMeasurement: "",
    recentIntervalChanges: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch current patient data to pre-populate form
  const { data: patient } = useQuery({
    queryKey: ['/api/patients', patientId],
    queryFn: async () => {
      const response = await fetch(`/api/patients/${patientId}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      return response.json();
    },
    enabled: isOpen
  });

  // Pre-populate form with existing data
  useEffect(() => {
    if (patient && isOpen) {
      setFormData({
        hemoglobinLevel: patient.hemoglobinLevel || "",
        ironLevels: patient.ironLevels || "",
        weight: patient.weight || "",
        symptoms: patient.symptomsBetweenTransfusions || "",
        chelationMedication: patient.chelationMedication || "",
        chelationFrequency: patient.chelationFrequency || "",
        lastSerumFerritin: patient.lastSerumFerritin || "",
        adverseReactions: patient.adverseReactionsHistory || "",
        diagnosis: patient.diagnosis || "",
        thalassemiaType: patient.thalassemiaType || "",
        ironChelationTherapy: patient.ironChelationTherapy || "",
        recentPreTransfusionHb: patient.recentPreTransfusionHb || "",
        usualTransfusionHbLevel: patient.usualTransfusionHbLevel || "",
        unitsPerSession: patient.unitsPerSession?.toString() || "",
        lastLiverIronMeasurement: patient.lastLiverIronMeasurement || "",
        recentIntervalChanges: patient.recentIntervalChanges || "",
      });
    }
  }, [patient, isOpen]);

  const updateHealthMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/patients/${patientId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update health data");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Health data updated successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/patients/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      onClose();
    },
    onError: () => {
      toast({ variant: "destructive", title: "Failed to update health data" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateHealthMutation.mutate({
      hemoglobinLevel: formData.hemoglobinLevel,
      ironLevels: formData.ironLevels,
      weight: formData.weight,
      symptomsBetweenTransfusions: formData.symptoms,
      chelationMedication: formData.chelationMedication,
      chelationFrequency: formData.chelationFrequency,
      lastSerumFerritin: formData.lastSerumFerritin,
      adverseReactionsHistory: formData.adverseReactions,
      diagnosis: formData.diagnosis,
      thalassemiaType: formData.thalassemiaType,
      ironChelationTherapy: formData.ironChelationTherapy,
      recentPreTransfusionHb: formData.recentPreTransfusionHb,
      usualTransfusionHbLevel: formData.usualTransfusionHbLevel,
      unitsPerSession: formData.unitsPerSession ? parseInt(formData.unitsPerSession) : null,
      lastLiverIronMeasurement: formData.lastLiverIronMeasurement,
      recentIntervalChanges: formData.recentIntervalChanges,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Health Data</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
                  placeholder="e.g., Thalassemia Major"
                />
              </div>
              <div>
                <Label htmlFor="thalassemiaType">Thalassemia Type</Label>
                <Select value={formData.thalassemiaType} onValueChange={(value) => setFormData(prev => ({ ...prev, thalassemiaType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beta-thalassemia-major">Beta Thalassemia Major</SelectItem>
                    <SelectItem value="beta-thalassemia-intermedia">Beta Thalassemia Intermedia</SelectItem>
                    <SelectItem value="alpha-thalassemia">Alpha Thalassemia</SelectItem>
                    <SelectItem value="hbe-beta-thalassemia">HbE Beta Thalassemia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                placeholder="e.g., 68 kg"
              />
            </div>
          </div>

          {/* Current Lab Values */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Lab Values</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
                <Input
                  id="hemoglobin"
                  value={formData.hemoglobinLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, hemoglobinLevel: e.target.value }))}
                  placeholder="e.g., 8.5"
                />
              </div>
              <div>
                <Label htmlFor="iron">Iron Levels (ng/mL)</Label>
                <Input
                  id="iron"
                  value={formData.ironLevels}
                  onChange={(e) => setFormData(prev => ({ ...prev, ironLevels: e.target.value }))}
                  placeholder="e.g., 850"
                />
              </div>
              <div>
                <Label htmlFor="ferritin">Last Serum Ferritin (ng/mL)</Label>
                <Input
                  id="ferritin"
                  value={formData.lastSerumFerritin}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastSerumFerritin: e.target.value }))}
                  placeholder="e.g., 2400"
                />
              </div>
            </div>
          </div>

          {/* Transfusion Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transfusion Information</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="preTransfusionHb">Recent Pre-transfusion Hb (g/dL)</Label>
                <Input
                  id="preTransfusionHb"
                  value={formData.recentPreTransfusionHb}
                  onChange={(e) => setFormData(prev => ({ ...prev, recentPreTransfusionHb: e.target.value }))}
                  placeholder="e.g., 7.8"
                />
              </div>
              <div>
                <Label htmlFor="usualHb">Usual Transfusion Hb Level (g/dL)</Label>
                <Input
                  id="usualHb"
                  value={formData.usualTransfusionHbLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, usualTransfusionHbLevel: e.target.value }))}
                  placeholder="e.g., 8.0"
                />
              </div>
              <div>
                <Label htmlFor="units">Units Per Session</Label>
                <Input
                  id="units"
                  type="number"
                  value={formData.unitsPerSession}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitsPerSession: e.target.value }))}
                  placeholder="e.g., 2"
                />
              </div>
            </div>
          </div>

          {/* Symptoms and Changes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Symptoms and Changes</h3>
            <div>
              <Label htmlFor="symptoms">Symptoms Between Transfusions</Label>
              <Textarea
                id="symptoms"
                value={formData.symptoms}
                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                placeholder="Describe any symptoms you experience..."
              />
            </div>
            <div>
              <Label htmlFor="intervalChanges">Recent Interval Changes</Label>
              <Textarea
                id="intervalChanges"
                value={formData.recentIntervalChanges}
                onChange={(e) => setFormData(prev => ({ ...prev, recentIntervalChanges: e.target.value }))}
                placeholder="Any recent changes in transfusion intervals..."
              />
            </div>
          </div>

          {/* Iron Chelation Therapy */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Iron Chelation Therapy</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="chelationTherapy">Iron Chelation Therapy</Label>
                <Select value={formData.ironChelationTherapy} onValueChange={(value) => setFormData(prev => ({ ...prev, ironChelationTherapy: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="considering">Considering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="medication">Chelation Medication</Label>
                <Select value={formData.chelationMedication} onValueChange={(value) => setFormData(prev => ({ ...prev, chelationMedication: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deferasirox">Deferasirox</SelectItem>
                    <SelectItem value="deferiprone">Deferiprone</SelectItem>
                    <SelectItem value="deferoxamine">Deferoxamine</SelectItem>
                    <SelectItem value="combination">Combination Therapy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frequency">Chelation Frequency</Label>
                <Select value={formData.chelationFrequency} onValueChange={(value) => setFormData(prev => ({ ...prev, chelationFrequency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice-daily">Twice Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as-needed">As Needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="liverIron">Last Liver Iron Measurement</Label>
              <Input
                id="liverIron"
                value={formData.lastLiverIronMeasurement}
                onChange={(e) => setFormData(prev => ({ ...prev, lastLiverIronMeasurement: e.target.value }))}
                placeholder="e.g., MRI T2* or biopsy results"
              />
            </div>
          </div>

          {/* Adverse Reactions */}
          <div>
            <Label htmlFor="reactions">Adverse Reactions History</Label>
            <Textarea
              id="reactions"
              value={formData.adverseReactions}
              onChange={(e) => setFormData(prev => ({ ...prev, adverseReactions: e.target.value }))}
              placeholder="Any adverse reactions to medications or treatments..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateHealthMutation.isPending}>
              {updateHealthMutation.isPending ? "Updating..." : "Update Health Data"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}