import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { HealthUpdateModal } from "@/components/health-update-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Heart, Droplet, PillBottle, FileText, Plus } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientHealthProps {
  user: AuthUser;
}

export default function PatientHealth({ user }: PatientHealthProps) {
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  const { data: transfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/patient', patient?.id],
    enabled: !!patient?.id,
  });

  const { data: donorFamily } = useQuery<any>({
    queryKey: ['/api/donor-family', patient?.id],
    enabled: !!patient?.id,
  });

  // Calculate last transfusion from actual transfusion records
  const completedTransfusions = transfusions.filter((t: any) => t.status === 'completed');
  const lastTransfusionDate = completedTransfusions.length > 0 
    ? completedTransfusions[0].scheduledDate || completedTransfusions[0].completedDate
    : null;

  const getTimeSince = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days ago`;
  };

  const getHealthStatus = (value: string, type: string) => {
    if (!value) return { status: 'unknown', color: 'gray' };

    const numValue = parseFloat(value);

    switch (type) {
      case 'hemoglobin':
        if (numValue >= 10) return { status: 'good', color: 'green' };
        if (numValue >= 7) return { status: 'moderate', color: 'yellow' };
        return { status: 'critical', color: 'red' };
      case 'iron':
        if (numValue <= 1000) return { status: 'good', color: 'green' };
        if (numValue <= 2500) return { status: 'moderate', color: 'yellow' };
        return { status: 'high', color: 'red' };
      default:
        return { status: 'unknown', color: 'gray' };
    }
  };

  const hemoglobinStatus = getHealthStatus(patient?.hemoglobinLevel, 'hemoglobin');
  const ironStatus = getHealthStatus(patient?.ironLevels, 'iron');

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Data & Metrics</h1>
          <p className="text-gray-600">Track your health metrics and manage your thalassemia care</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Hemoglobin Level */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-red-600" />
                </div>
                <Badge variant={hemoglobinStatus.color === 'green' ? 'default' : hemoglobinStatus.color === 'yellow' ? 'secondary' : 'destructive'}>
                  {hemoglobinStatus.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Hemoglobin Level</h3>
              <p className="text-2xl font-bold text-gray-900">{patient?.hemoglobinLevel || "N/A"}</p>
              <p className="text-sm text-gray-600">g/dL</p>
            </CardContent>
          </Card>

          {/* Iron Levels */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <Badge variant={ironStatus.color === 'green' ? 'default' : ironStatus.color === 'yellow' ? 'secondary' : 'destructive'}>
                  {ironStatus.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Iron Levels</h3>
              <p className="text-2xl font-bold text-gray-900">{patient?.ironLevels || "N/A"}</p>
              <p className="text-sm text-gray-600">ng/mL</p>
            </CardContent>
          </Card>

          {/* Last Transfusion */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Last Transfusion</h3>
              <p className="text-2xl font-bold text-gray-900">
                {lastTransfusionDate ? getTimeSince(lastTransfusionDate) : "Never"}
              </p>
              <p className="text-sm text-gray-600">days ago</p>
            </CardContent>
          </Card>

          {/* Total Transfusions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Total Transfusions</h3>
              <p className="text-2xl font-bold text-gray-900">{completedTransfusions.length}</p>
              <p className="text-sm text-gray-600">lifetime</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Detailed Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Detailed Health Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Thalassemia Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{patient?.thalassemiaType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diagnosis:</span>
                    <span className="font-medium">{patient?.diagnosis || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight:</span>
                    <span className="font-medium">{patient?.weight || 'Not recorded'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Transfusion Pattern</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{patient?.manualTransfusionFrequency || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pre-transfusion Hb:</span>
                    <span className="font-medium">{patient?.recentPreTransfusionHb || 'Not recorded'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units per session:</span>
                    <span className="font-medium">{patient?.unitsPerSession || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Symptoms & Complications</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Symptoms between transfusions:</span>
                    <span className="font-medium">{patient?.symptomsBetweenTransfusions || 'None reported'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organ issues:</span>
                    <span className="font-medium">{patient?.organIssuesHistory || 'None reported'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth issues:</span>
                    <span className="font-medium">{patient?.poorGrowthHistory ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bone deformities:</span>
                    <span className="font-medium">{patient?.boneDeformities ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recurrent infections:</span>
                    <span className="font-medium">{patient?.recurrentInfections ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Iron Chelation Therapy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PillBottle className="w-5 h-5 mr-2" />
                Iron Chelation Therapy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Current Treatment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chelation therapy:</span>
                    <Badge variant={patient?.ironChelationTherapy === 'yes' ? 'default' : 'secondary'}>
                      {patient?.ironChelationTherapy || 'Not specified'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medication:</span>
                    <span className="font-medium">{patient?.chelationMedication || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium">{patient?.chelationFrequency || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Iron Assessment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last serum ferritin:</span>
                    <span className="font-medium">{patient?.lastSerumFerritin || 'Not recorded'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last liver iron measurement:</span>
                    <span className="font-medium">{patient?.lastLiverIronMeasurement || 'Not recorded'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Adverse reactions:</span>
                    <span className="font-medium">{patient?.adverseReactionsHistory || 'None reported'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Iron Overload Status</h5>
                <p className="text-sm text-blue-800">
                  Based on your current iron levels ({patient?.ironLevels || 'N/A'} ng/mL), 
                  {ironStatus.status === 'good' && ' your iron levels are within normal range.'}
                  {ironStatus.status === 'moderate' && ' your iron levels are elevated and require monitoring.'}
                  {ironStatus.status === 'high' && ' your iron levels are significantly elevated and may require treatment adjustment.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {patient && (
        <HealthUpdateModal 
          isOpen={healthModalOpen} 
          onClose={() => setHealthModalOpen(false)} 
          patientId={patient.id} 
        />
      )}
    </div>
  );
}