import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Calendar, Users, Droplet, TrendingUp } from "lucide-react";
import { type AuthUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";

interface HospitalDashboardProps {
  user: AuthUser;
}

export default function HospitalDashboard({ user }: HospitalDashboardProps) {
  const { data: provider } = useQuery<any>({
    queryKey: ['/api/providers/user', user.id],
    enabled: !!user.id,
  });

  const { data: todayAppointmentsData } = useQuery({
    queryKey: ['appointments', 'today', provider?.id],
    queryFn: () => apiRequest('GET', `/api/appointments/today/${provider?.id}`),
    enabled: !!provider?.id,
  });

  const { data: patients } = useQuery<any[]>({
    queryKey: ['/api/patients'],
    enabled: !!provider,
  });

  const { data: donors } = useQuery<any[]>({
    queryKey: ['/api/donors'],
    enabled: !!provider,
  });

  // Calculate blood availability by type
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const bloodAvailability = bloodTypes.map(type => {
    // Count available donors of this blood type
    const availableDonors = donors?.filter(d => 
      d.user?.blood_group === type && d.availableForDonation
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
    const bloodType = patient.user?.blood_group;
    const availability = bloodAvailability.find(b => b.type === bloodType);
    return availability && availability.units < 5;
  }) || [];

  // Get hospital name from provider data
  const hospitalName = provider?.hospitalName || user.name;

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{hospitalName}</h1>
          <p className="text-gray-600">Healthcare Provider Dashboard</p>
        </div>

        {/* Today's Appointments Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Appointments Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayAppointmentsData?.patientAppointments?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">At your location today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donor Appointments Today</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayAppointmentsData?.donorAppointments?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">At your location today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donors</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donors?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Registered donors</p>
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
                      <p className="text-sm text-gray-600">Blood Type: {patient.user?.blood_group}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-600 font-medium">
                        Only {bloodAvailability.find(b => b.type === patient.user?.blood_group)?.units || 0} units available
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