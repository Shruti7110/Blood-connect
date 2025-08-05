import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Save, User } from "lucide-react";

interface PatientDetailsFormProps {
  patient: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export function PatientDetailsForm({ patient, onSubmit, onCancel }: PatientDetailsFormProps) {
  const [formData, setFormData] = useState({
    dateOfBirth: patient?.dateOfBirth || "",
    weight: patient?.weight || "",
    diagnosis: patient?.diagnosis || "",
    thalassemiaType: patient?.thalassemiaType || "",
    recentPreTransfusionHb: patient?.recentPreTransfusionHb || "",
    symptomsBetweenTransfusions: patient?.symptomsBetweenTransfusions || "",
    poorGrowthHistory: patient?.poorGrowthHistory || false,
    boneDeformities: patient?.boneDeformities || false,
    recurrentInfections: patient?.recurrentInfections || false,
    organIssuesHistory: patient?.organIssuesHistory || "",
    transfusionFrequencyPast6Months: patient?.transfusionFrequencyPast6Months || "",
    unitsPerSession: patient?.unitsPerSession || "",
    usualTransfusionHbLevel: patient?.usualTransfusionHbLevel || "",
    recentIntervalChanges: patient?.recentIntervalChanges || "",
    ironChelationTherapy: patient?.ironChelationTherapy || "",
    chelationMedication: patient?.chelationMedication || "",
    chelationFrequency: patient?.chelationFrequency || "",
    lastSerumFerritin: patient?.lastSerumFerritin || "",
    lastLiverIronMeasurement: patient?.lastLiverIronMeasurement || "",
    adverseReactionsHistory: patient?.adverseReactionsHistory || "",
    manualTransfusionFrequency: patient?.manualTransfusionFrequency || "",
    hemoglobinLevel: patient?.hemoglobinLevel || "",
    ironLevels: patient?.ironLevels || "",
    lastTransfusion: patient?.lastTransfusion || "",
    totalTransfusions: patient?.totalTransfusions || "",
    ferritinLevels: patient?.ferritinLevels || "",
    bloodPressure: patient?.bloodPressure || "",
    heartRate: patient?.heartRate || "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-600" />
            <span>Complete Patient Medical Profile</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">1</Badge>
                <span>Basic Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="text"
                    value={formData.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="e.g., 65"
                  />
                </div>
                <div>
                  <Label htmlFor="diagnosis">Primary Diagnosis</Label>
                  <Input
                    id="diagnosis"
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => handleInputChange("diagnosis", e.target.value)}
                    placeholder="e.g., Beta Thalassemia Major"
                  />
                </div>
                <div>
                  <Label htmlFor="thalassemiaType">Thalassemia Type</Label>
                  <Input
                    id="thalassemiaType"
                    type="text"
                    value={formData.thalassemiaType}
                    onChange={(e) => handleInputChange("thalassemiaType", e.target.value)}
                    placeholder="e.g., Beta Thalassemia Major"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Clinical Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">2</Badge>
                <span>Current Clinical Status</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="recentPreTransfusionHb">Recent Pre-transfusion Hb</Label>
                  <Input
                    id="recentPreTransfusionHb"
                    type="text"
                    value={formData.recentPreTransfusionHb}
                    onChange={(e) => handleInputChange("recentPreTransfusionHb", e.target.value)}
                    placeholder="e.g., 8.5 g/dL"
                  />
                </div>
                <div>
                  <Label htmlFor="hemoglobinLevel">Current Hemoglobin Level</Label>
                  <Input
                    id="hemoglobinLevel"
                    type="text"
                    value={formData.hemoglobinLevel}
                    onChange={(e) => handleInputChange("hemoglobinLevel", e.target.value)}
                    placeholder="e.g., 9.2 g/dL"
                  />
                </div>
                <div>
                  <Label htmlFor="ironLevels">Iron Levels</Label>
                  <Input
                    id="ironLevels"
                    type="text"
                    value={formData.ironLevels}
                    onChange={(e) => handleInputChange("ironLevels", e.target.value)}
                    placeholder="e.g., 150 µg/dL"
                  />
                </div>
                <div>
                  <Label htmlFor="ferritinLevels">Ferritin Levels</Label>
                  <Input
                    id="ferritinLevels"
                    type="text"
                    value={formData.ferritinLevels}
                    onChange={(e) => handleInputChange("ferritinLevels", e.target.value)}
                    placeholder="e.g., 2500 ng/mL"
                  />
                </div>
                <div>
                  <Label htmlFor="bloodPressure">Blood Pressure</Label>
                  <Input
                    id="bloodPressure"
                    type="text"
                    value={formData.bloodPressure}
                    onChange={(e) => handleInputChange("bloodPressure", e.target.value)}
                    placeholder="e.g., 120/80"
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate}
                    onChange={(e) => handleInputChange("heartRate", parseInt(e.target.value) || 0)}
                    placeholder="e.g., 72"
                  />
                </div>
                <div>
                  <Label htmlFor="totalTransfusions">Total Transfusions</Label>
                  <Input
                    id="totalTransfusions"
                    type="number"
                    value={formData.totalTransfusions}
                    onChange={(e) => handleInputChange("totalTransfusions", parseInt(e.target.value) || 0)}
                    placeholder="e.g., 45"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="symptomsBetweenTransfusions">Symptoms Between Transfusions</Label>
                <Textarea
                  id="symptomsBetweenTransfusions"
                  value={formData.symptomsBetweenTransfusions}
                  onChange={(e) => handleInputChange("symptomsBetweenTransfusions", e.target.value)}
                  placeholder="Describe any symptoms experienced between transfusions..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Medical History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">3</Badge>
                <span>Medical History</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="poorGrowthHistory"
                    checked={formData.poorGrowthHistory}
                    onChange={(e) => handleInputChange("poorGrowthHistory", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="poorGrowthHistory">History of Poor Growth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="boneDeformities"
                    checked={formData.boneDeformities}
                    onChange={(e) => handleInputChange("boneDeformities", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="boneDeformities">Bone Deformities</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurrentInfections"
                    checked={formData.recurrentInfections}
                    onChange={(e) => handleInputChange("recurrentInfections", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="recurrentInfections">Recurrent Infections</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="organIssuesHistory">Organ Issues History</Label>
                <Textarea
                  id="organIssuesHistory"
                  value={formData.organIssuesHistory}
                  onChange={(e) => handleInputChange("organIssuesHistory", e.target.value)}
                  placeholder="Describe any organ-related complications..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Transfusion History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">4</Badge>
                <span>Transfusion Details</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="transfusionFrequencyPast6Months">Transfusion Frequency (Past 6 Months)</Label>
                  <Input
                    id="transfusionFrequencyPast6Months"
                    type="text"
                    value={formData.transfusionFrequencyPast6Months}
                    onChange={(e) => handleInputChange("transfusionFrequencyPast6Months", e.target.value)}
                    placeholder="e.g., Every 3 weeks"
                  />
                </div>
                <div>
                  <Label htmlFor="unitsPerSession">Units per Session</Label>
                  <Input
                    id="unitsPerSession"
                    type="number"
                    value={formData.unitsPerSession}
                    onChange={(e) => handleInputChange("unitsPerSession", parseInt(e.target.value) || 0)}
                    placeholder="e.g., 2"
                  />
                </div>
                <div>
                  <Label htmlFor="usualTransfusionHbLevel">Usual Transfusion Hb Level</Label>
                  <Input
                    id="usualTransfusionHbLevel"
                    type="text"
                    value={formData.usualTransfusionHbLevel}
                    onChange={(e) => handleInputChange("usualTransfusionHbLevel", e.target.value)}
                    placeholder="e.g., 11.5 g/dL"
                  />
                </div>
                <div>
                  <Label htmlFor="lastTransfusion">Last Transfusion Date</Label>
                  <Input
                    id="lastTransfusion"
                    type="date"
                    value={formData.lastTransfusion}
                    onChange={(e) => handleInputChange("lastTransfusion", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="recentIntervalChanges">Recent Interval Changes</Label>
                <Textarea
                  id="recentIntervalChanges"
                  value={formData.recentIntervalChanges}
                  onChange={(e) => handleInputChange("recentIntervalChanges", e.target.value)}
                  placeholder="Describe any recent changes in transfusion intervals..."
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Iron Chelation */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">5</Badge>
                <span>Iron Chelation Therapy</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ironChelationTherapy">Iron Chelation Therapy Status</Label>
                  <Input
                    id="ironChelationTherapy"
                    type="text"
                    value={formData.ironChelationTherapy}
                    onChange={(e) => handleInputChange("ironChelationTherapy", e.target.value)}
                    placeholder="e.g., Active, Suspended, Not Started"
                  />
                </div>
                <div>
                  <Label htmlFor="chelationMedication">Chelation Medication</Label>
                  <Input
                    id="chelationMedication"
                    type="text"
                    value={formData.chelationMedication}
                    onChange={(e) => handleInputChange("chelationMedication", e.target.value)}
                    placeholder="e.g., Deferasirox, Deferoxamine"
                  />
                </div>
                <div>
                  <Label htmlFor="chelationFrequency">Chelation Frequency</Label>
                  <Input
                    id="chelationFrequency"
                    type="text"
                    value={formData.chelationFrequency}
                    onChange={(e) => handleInputChange("chelationFrequency", e.target.value)}
                    placeholder="e.g., Daily, 3 times per week"
                  />
                </div>
                <div>
                  <Label htmlFor="lastSerumFerritin">Last Serum Ferritin</Label>
                  <Input
                    id="lastSerumFerritin"
                    type="text"
                    value={formData.lastSerumFerritin}
                    onChange={(e) => handleInputChange("lastSerumFerritin", e.target.value)}
                    placeholder="e.g., 2500 ng/mL"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastLiverIronMeasurement">Last Liver Iron Measurement</Label>
                <Input
                  id="lastLiverIronMeasurement"
                  type="text"
                  value={formData.lastLiverIronMeasurement}
                  onChange={(e) => handleInputChange("lastLiverIronMeasurement", e.target.value)}
                  placeholder="e.g., MRI T2* or LIC value"
                />
              </div>
            </div>

            <Separator />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Badge variant="outline">6</Badge>
                <span>Additional Information</span>
              </h3>
              <div>
                <Label htmlFor="adverseReactionsHistory">Adverse Reactions History</Label>
                <Textarea
                  id="adverseReactionsHistory"
                  value={formData.adverseReactionsHistory}
                  onChange={(e) => handleInputChange("adverseReactionsHistory", e.target.value)}
                  placeholder="Describe any adverse reactions to transfusions or medications..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="manualTransfusionFrequency">Manual Transfusion Frequency</Label>
                <Input
                  id="manualTransfusionFrequency"
                  type="text"
                  value={formData.manualTransfusionFrequency}
                  onChange={(e) => handleInputChange("manualTransfusionFrequency", e.target.value)}
                  placeholder="e.g., Every 21 days"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex items-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Patient Details</span>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}