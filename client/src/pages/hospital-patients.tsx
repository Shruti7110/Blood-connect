import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Search, User, Heart, Users, Droplet, Clock } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface HospitalPatientsProps {
  user: AuthUser;
}

export default function HospitalPatients({ user }: HospitalPatientsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showHealthMetrics, setShowHealthMetrics] = useState(false);
  const [showDonorFamily, setShowDonorFamily] = useState(false);
  const [showComprehensiveForm, setShowComprehensiveForm] = useState(false); // State for the new form

  const { data: provider } = useQuery<any>({
    queryKey: ['/api/providers/user', user.id],
    enabled: !!user.id,
  });

  const { data: upcomingTransfusions } = useQuery<any[]>({
    queryKey: ['/api/transfusions/upcoming'],
    enabled: !!provider,
  });

  const { data: patients } = useQuery<any[]>({
    queryKey: ['/api/patients'],
    enabled: !!provider,
  });

  const { data: patientFamily } = useQuery<any>({
    queryKey: ['/api/donor-family', selectedPatient?.id],
    enabled: !!selectedPatient?.id && showDonorFamily,
  });

  // Filter upcoming appointments for this hospital
  const hospitalName = provider?.hospital_name || provider?.hospitalName;
  const hospitalAppointments = upcomingTransfusions?.filter(t => {
    const appointmentDate = new Date(t.scheduledDate || t.scheduled_date);
    const now = new Date();

    const isAtThisHospital = hospitalName && t.location?.includes(hospitalName);
    const isUpcoming = appointmentDate >= now; // Include appointments starting from now
    return isAtThisHospital && isUpcoming && t.patient_id;
  }) || [];

  // Filter patients based on search term
  const filteredPatients = patients?.filter(patient =>
    patient.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getDonorAvailabilityStatus = (lastDonation: string) => {
    if (!lastDonation) return { status: 'available', days: 0 };

    const lastDonationDate = new Date(lastDonation);
    const now = new Date();
    const daysSinceLastDonation = Math.floor((now.getTime() - lastDonationDate.getTime()) / (1000 * 3600 * 24));

    if (daysSinceLastDonation >= 90) { // 3 months
      return { status: 'available', days: daysSinceLastDonation };
    } else {
      return { status: 'unavailable', days: daysSinceLastDonation };
    }
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Patients</h1>
          <p className="text-gray-600">{provider?.hospital_name || provider?.hospitalName || 'Hospital'} - Patient Management</p>
        </div>

        {/* Upcoming Patient Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Upcoming Patient Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospitalAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitalAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{appointment.patient?.user?.name || 'Unknown Patient'}</p>
                        <p className="text-sm text-gray-600">{formatDateTime(appointment.scheduledDate || appointment.scheduled_date)}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient Search and List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>All Patients</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search patients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
              <Button onClick={() => setShowComprehensiveForm(true)}>            
                Add All Patient Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {patient.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'P'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.user?.name}</p>
                        <p className="text-sm text-gray-600">{patient.user?.bloodGroup}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowDetails(true);
                        }}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        View Details
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowHealthMetrics(true);
                        }}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Update Health Metrics
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowDonorFamily(true);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        View Donor Family
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Details Modal */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl" aria-describedby="patient-details-description">
            <DialogHeader>
              <DialogTitle>Patient Details</DialogTitle>
              <p id="patient-details-description" className="text-sm text-gray-600">
                Detailed health information for {selectedPatient?.user?.name}
              </p>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPatient.user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-medium">{selectedPatient.user?.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Hemoglobin Level</p>
                    <p className="font-medium">{selectedPatient.hemoglobinLevel || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Iron Levels</p>
                    <p className="font-medium">{selectedPatient.ironLevels || 'Not recorded'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Transfusion</p>
                    <p className="font-medium">
                      {selectedPatient.lastTransfusion ? formatDateTime(selectedPatient.lastTransfusion) : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Transfusions</p>
                    <p className="font-medium">{selectedPatient.totalTransfusions || 0}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Health Metrics Update Modal */}
        <Dialog open={showHealthMetrics} onOpenChange={setShowHealthMetrics}>
          <DialogContent className="max-w-3xl max-h-[80vh]" aria-describedby="health-metrics-description">
            <DialogHeader>
              <DialogTitle>Update Health Metrics</DialogTitle>
              <p id="health-metrics-description" className="text-sm text-gray-600">
                Update health metrics for {selectedPatient?.user?.name}
              </p>
            </DialogHeader>
            {selectedPatient && (
              <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Hemoglobin Level (g/dL)</label>
                    <Input defaultValue={selectedPatient.hemoglobinLevel || ''} placeholder="e.g., 10.5" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Iron Levels (ng/mL)</label>
                    <Input defaultValue={selectedPatient.ironLevels || ''} placeholder="e.g., 1200" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Weight (kg)</label>
                    <Input defaultValue={selectedPatient.weight || ''} placeholder="e.g., 65" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Ferritin Levels (ng/mL)</label>
                    <Input defaultValue={selectedPatient.ferritinLevels || ''} placeholder="e.g., 800" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Blood Pressure</label>
                    <Input defaultValue={selectedPatient.bloodPressure || ''} placeholder="e.g., 120/80" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Heart Rate (bpm)</label>
                    <Input defaultValue={selectedPatient.heartRate || ''} placeholder="e.g., 72" />
                  </div>
                </div>
                <Button className="w-full">Update Health Metrics</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Donor Family Modal */}
        <Dialog open={showDonorFamily} onOpenChange={setShowDonorFamily}>
          <DialogContent className="max-w-4xl max-h-[80vh]" aria-describedby="donor-family-description">
            <DialogHeader>
              <DialogTitle>Donor Family</DialogTitle>
              <p id="donor-family-description" className="text-sm text-gray-600">
                Donor family members for {selectedPatient?.user?.name}
              </p>
            </DialogHeader>
            {patientFamily?.family && (
              <div className="space-y-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patientFamily.family.map((member: any) => {
                    const availability = getDonorAvailabilityStatus(member.donor?.last_donation);
                    return (
                      <div key={member.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{member.user?.name}</p>
                            <p className="text-sm text-gray-600">{member.user?.bloodGroup}</p>
                            <p className="text-sm text-gray-600">{member.user?.phone}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={availability.status === 'available' ? 'default' : 'secondary'}
                              className="mb-2"
                            >
                              {availability.status === 'available' ? 'Available' : 'Not Available'}
                            </Badge>
                            {availability.days > 0 && (
                              <p className="text-xs text-gray-500">
                                {availability.days} days since last donation
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">Blood Availability Check</h4>
                  <p className="text-sm text-gray-600">
                    Available Donors: {patientFamily.family.filter((m: any) =>
                      getDonorAvailabilityStatus(m.donor?.last_donation).status === 'available'
                    ).length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Estimated Available Units: {patientFamily.family.filter((m: any) =>
                      getDonorAvailabilityStatus(m.donor?.last_donation).status === 'available'
                    ).length * 2}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Comprehensive Patient Details Form Modal */}
        <Dialog open={showComprehensiveForm} onOpenChange={setShowComprehensiveForm}>
          <DialogContent className="max-w-5xl max-h-[90vh]" aria-describedby="comprehensive-patient-form-description">
            <DialogHeader>
              <DialogTitle>Add Comprehensive Patient Details</DialogTitle>
              <p id="comprehensive-patient-form-description" className="text-sm text-gray-600">
                Fill in all patient details for new or existing patients.
              </p>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}