import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Users, Droplet, TrendingUp } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface HospitalDashboardProps {
  user: AuthUser;
}

export default function HospitalDashboard({ user }: HospitalDashboardProps) {
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

  const { data: donors } = useQuery<any[]>({
    queryKey: ['/api/donors'],
    enabled: !!provider,
  });

  // Debug log to see what data we're getting
  console.log('Hospital Dashboard Data:', {
    provider,
    patients,
    donors,
    patientsCount: patients?.length,
    donorsCount: donors?.length
  });

  // Filter appointments for today at this hospital
  const hospitalName = provider?.hospital_name || provider?.hospitalName;
  const todayAppointments = upcomingTransfusions?.filter(t => {
    const appointmentDate = new Date(t.scheduledDate || t.scheduled_date);
    const today = new Date();
    
    // Set both dates to start of day for accurate comparison
    const appointmentDay = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const isToday = appointmentDay.getTime() === todayDay.getTime();
    const isAtThisHospital = hospitalName && t.location?.includes(hospitalName);
    
    console.log('Checking appointment:', {
      appointmentDate: appointmentDate.toISOString(),
      appointmentDay: appointmentDay.toISOString(),
      todayDay: todayDay.toISOString(),
      isToday,
      isAtThisHospital,
      location: t.location,
      hospitalName
    });
    
    return isToday && isAtThisHospital;
  }) || [];

  const patientAppointmentsToday = todayAppointments.filter(t => t.patient_id);
  const donorAppointmentsToday = todayAppointments.filter(t => t.donor_id);

  // Calculate blood availability by type
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const bloodAvailability = bloodTypes.map(type => {
    // Count available donors of this blood type
    const availableDonors = donors?.filter(d => 
      d.user?.bloodGroup === type && d.availableForDonation
    )?.length || 0;
    
    // Calculate units (assuming 2 units per available donor)
    const availableUnits = availableDonors * 2;
    
    return {
      type,
      units: availableUnits,
      status: availableUnits < 5 ? 'low' : availableUnits < 10 ? 'medium' : 'high'
    };
  });

  // Find patients with low blood availability
  const lowStockPatients = patients?.filter(patient => {
    const bloodType = patient.user?.bloodGroup;
    const availability = bloodAvailability.find(b => b.type === bloodType);
    return availability && availability.units < 5;
  }) || [];

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Dashboard</h1>
          <p className="text-gray-600">{provider?.hospital_name || provider?.hospitalName || 'Healthcare Provider Dashboard'}</p>
        </div>

        {/* Today's Appointments Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Patient Appointments Today</p>
                  <p className="text-2xl font-bold text-blue-600">{patientAppointmentsToday.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Droplet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Donor Appointments Today</p>
                  <p className="text-2xl font-bold text-green-600">{donorAppointmentsToday.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blood Availability by Type */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-red-500" />
              <span>Blood Units Available by Type</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {bloodAvailability.map((blood) => (
                <div key={blood.type} className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    blood.status === 'high' ? 'bg-green-100 text-green-700' :
                    blood.status === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    <span className="font-bold text-lg">{blood.type}</span>
                  </div>
                  <p className="text-2xl font-bold">{blood.units}</p>
                  <p className="text-xs text-gray-500">units</p>
                  <Badge 
                    variant={blood.status === 'high' ? 'default' : 'destructive'}
                    className="text-xs mt-1"
                  >
                    {blood.status === 'high' ? 'Good' : blood.status === 'medium' ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Upcoming Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTransfusions && upcomingTransfusions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingTransfusions.filter(t => {
                  const appointmentDate = new Date(t.scheduledDate || t.scheduled_date);
                  const now = new Date();
                  const isAtThisHospital = hospitalName && t.location?.includes(hospitalName);
                  const isUpcoming = appointmentDate >= now;
                  return isAtThisHospital && isUpcoming;
                }).map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">
                          {appointment.patient?.user?.name || 'Patient Appointment'}
                        </p>
                        <p className="text-sm text-blue-700">
                          {new Date(appointment.scheduledDate || appointment.scheduled_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Location:</strong> {appointment.location}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Units Required:</strong> {appointment.unitsRequired || 2}
                      </p>
                      <Badge 
                        variant={appointment.status === 'scheduled' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {appointment.status || 'Scheduled'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No upcoming appointments at this hospital</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Notifications */}
        {lowStockPatients.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span>Low Blood Stock Alerts</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium">{patient.user?.name}</p>
                      <p className="text-sm text-gray-600">Blood Type: {patient.user?.bloodGroup}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">
                        Only {bloodAvailability.find(b => b.type === patient.user?.bloodGroup)?.units || 0} units available
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        Critical
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}