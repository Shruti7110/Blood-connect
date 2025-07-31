
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientDetailsFormProps {
  onSubmit: (data: any) => void;
  loading: boolean;
}

export function PatientDetailsForm({ onSubmit, loading }: PatientDetailsFormProps) {
  const [formData, setFormData] = useState({
    // Demographics
    dateOfBirth: "",
    weight: "",
    thalassemiaType: "",
    
    // Clinical status
    recentPreTransfusionHb: "",
    symptomsBetweenTransfusions: "",
    poorGrowthHistory: false,
    boneDeformities: false,
    recurrentInfections: false,
    organIssuesHistory: "",
    
    // Transfusion history
    transfusionFrequencyPast6Months: "",
    unitsPerSession: "",
    usualTransfusionHbLevel: "",
    recentIntervalChanges: "",
    
    // Iron overload
    ironChelationTherapy: "",
    chelationMedication: "",
    chelationFrequency: "",
    lastSerumFerritin: "",
    lastLiverIronMeasurement: "",
    adverseReactionsHistory: "",
    
    // Manual frequency
    manualTransfusionFrequency: "",
  });

  const [useManualFrequency, setUseManualFrequency] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Patient Medical Details</CardTitle>
        <CardDescription>
          Please provide your medical information to help us determine your transfusion frequency.
          You can either fill out the detailed form or manually specify your frequency.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="manual-frequency"
              checked={useManualFrequency}
              onCheckedChange={setUseManualFrequency}
            />
            <Label htmlFor="manual-frequency">
              I prefer to manually specify my transfusion frequency
            </Label>
          </div>
        </div>

        {useManualFrequency ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="manualFrequency">Transfusion Frequency</Label>
              <Select 
                value={formData.manualTransfusionFrequency} 
                onValueChange={(value) => handleInputChange("manualTransfusionFrequency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="every-2-weeks">Every 2 weeks</SelectItem>
                  <SelectItem value="every-3-weeks">Every 3 weeks</SelectItem>
                  <SelectItem value="every-4-weeks">Every 4 weeks</SelectItem>
                  <SelectItem value="every-6-weeks">Every 6 weeks</SelectItem>
                  <SelectItem value="every-8-weeks">Every 8 weeks</SelectItem>
                  <SelectItem value="as-needed">As needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? "Completing Registration..." : "Complete Registration"}
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="demographics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="clinical">Clinical Status</TabsTrigger>
                <TabsTrigger value="transfusion">Transfusion History</TabsTrigger>
                <TabsTrigger value="chelation">Iron & Chelation</TabsTrigger>
              </TabsList>

              <TabsContent value="demographics" className="space-y-4 mt-6">
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
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 65"
                      value={formData.weight}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="thalassemiaType">Type of Thalassemia</Label>
                  <Select 
                    value={formData.thalassemiaType} 
                    onValueChange={(value) => handleInputChange("thalassemiaType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select thalassemia type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beta-thalassemia-major">β-thalassemia major</SelectItem>
                      <SelectItem value="hbe-beta-thalassemia">HbE β-thalassemia</SelectItem>
                      <SelectItem value="thalassemia-intermedia">Thalassemia intermedia</SelectItem>
                      <SelectItem value="alpha-thalassemia">α-thalassemia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="recentPreTransfusionHb">Most Recent Pre-transfusion Hemoglobin Level (g/dL)</Label>
                  <Input
                    id="recentPreTransfusionHb"
                    placeholder="e.g., 8.5"
                    value={formData.recentPreTransfusionHb}
                    onChange={(e) => handleInputChange("recentPreTransfusionHb", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="symptomsBetweenTransfusions">Symptoms Between Transfusions</Label>
                  <Textarea
                    id="symptomsBetweenTransfusions"
                    placeholder="Describe any fatigue, shortness of breath, pallor, etc."
                    value={formData.symptomsBetweenTransfusions}
                    onChange={(e) => handleInputChange("symptomsBetweenTransfusions", e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  <Label>Medical History (check all that apply)</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="poorGrowth"
                      checked={formData.poorGrowthHistory}
                      onCheckedChange={(checked) => handleInputChange("poorGrowthHistory", checked)}
                    />
                    <Label htmlFor="poorGrowth">Poor growth (for children)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="boneDeformities"
                      checked={formData.boneDeformities}
                      onCheckedChange={(checked) => handleInputChange("boneDeformities", checked)}
                    />
                    <Label htmlFor="boneDeformities">Bone deformities</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recurrentInfections"
                      checked={formData.recurrentInfections}
                      onCheckedChange={(checked) => handleInputChange("recurrentInfections", checked)}
                    />
                    <Label htmlFor="recurrentInfections">Recurrent infections</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="organIssuesHistory">History of Organ Issues</Label>
                  <Textarea
                    id="organIssuesHistory"
                    placeholder="Any cardiac, liver, spleen issues, etc."
                    value={formData.organIssuesHistory}
                    onChange={(e) => handleInputChange("organIssuesHistory", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="transfusion" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="transfusionFrequencyPast6Months">Transfusion Frequency in Past 6-12 Months</Label>
                  <Select 
                    value={formData.transfusionFrequencyPast6Months} 
                    onValueChange={(value) => handleInputChange("transfusionFrequencyPast6Months", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every-2-weeks">Every 2 weeks</SelectItem>
                      <SelectItem value="every-3-weeks">Every 3 weeks</SelectItem>
                      <SelectItem value="every-4-weeks">Every 4 weeks</SelectItem>
                      <SelectItem value="every-6-weeks">Every 6 weeks</SelectItem>
                      <SelectItem value="irregular">Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitsPerSession">Units of Blood per Session</Label>
                    <Input
                      id="unitsPerSession"
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.unitsPerSession}
                      onChange={(e) => handleInputChange("unitsPerSession", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="usualTransfusionHbLevel">Usual Transfusion Hemoglobin Level (g/dL)</Label>
                    <Input
                      id="usualTransfusionHbLevel"
                      placeholder="e.g., 8.0"
                      value={formData.usualTransfusionHbLevel}
                      onChange={(e) => handleInputChange("usualTransfusionHbLevel", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="recentIntervalChanges">Recent Changes in Transfusion Interval</Label>
                  <Textarea
                    id="recentIntervalChanges"
                    placeholder="Has your transfusion interval changed recently? If so, why?"
                    value={formData.recentIntervalChanges}
                    onChange={(e) => handleInputChange("recentIntervalChanges", e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="chelation" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="ironChelationTherapy">Are you currently on iron chelation therapy?</Label>
                  <Select 
                    value={formData.ironChelationTherapy} 
                    onValueChange={(value) => handleInputChange("ironChelationTherapy", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="sometimes">Sometimes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.ironChelationTherapy === "yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="chelationMedication">Chelation Medication</Label>
                      <Input
                        id="chelationMedication"
                        placeholder="e.g., Deferasirox, Deferoxamine"
                        value={formData.chelationMedication}
                        onChange={(e) => handleInputChange("chelationMedication", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="chelationFrequency">How regularly do you take it?</Label>
                      <Select 
                        value={formData.chelationFrequency} 
                        onValueChange={(value) => handleInputChange("chelationFrequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="most-days">Most days</SelectItem>
                          <SelectItem value="few-times-week">Few times a week</SelectItem>
                          <SelectItem value="irregularly">Irregularly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lastSerumFerritin">Last Serum Ferritin Level (ng/mL)</Label>
                    <Input
                      id="lastSerumFerritin"
                      placeholder="e.g., 2500"
                      value={formData.lastSerumFerritin}
                      onChange={(e) => handleInputChange("lastSerumFerritin", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastLiverIronMeasurement">Last Liver Iron Measurement</Label>
                    <Input
                      id="lastLiverIronMeasurement"
                      placeholder="If available"
                      value={formData.lastLiverIronMeasurement}
                      onChange={(e) => handleInputChange("lastLiverIronMeasurement", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="adverseReactionsHistory">Adverse Reactions History</Label>
                  <Textarea
                    id="adverseReactionsHistory"
                    placeholder="Any adverse reactions to transfusions or chelation therapy"
                    value={formData.adverseReactionsHistory}
                    onChange={(e) => handleInputChange("adverseReactionsHistory", e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full mt-6">
                  {loading ? "Completing Registration..." : "Complete Registration"}
                </Button>
              </TabsContent>
            </Tabs>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
