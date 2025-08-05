import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Heart, Droplet, Activity, Bot } from "lucide-react";
import { type AuthUser } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";

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
    queryFn: async () => {
      const response = await fetch(`/api/appointments/today/${provider?.id}`);
      if (!response.ok) throw new Error('Failed to fetch appointments');
      return response.json();
    },
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

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Today's Patient Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Appointments Today</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayAppointmentsData?.patientAppointments?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Transfusions scheduled
              </p>
            </CardContent>
          </Card>

          {/* Today's Donor Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donor Appointments Today</CardTitle>
              <Droplet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayAppointmentsData?.donorAppointments?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Donations scheduled
              </p>
            </CardContent>
          </Card>

          {/* Total Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered patients
              </p>
            </CardContent>
          </Card>

          {/* Available Donors */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Donors</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {donors?.filter(d => d.availableForDonation)?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready to donate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blood Inventory and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Blood Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Droplet className="w-5 h-5 text-red-500" />
                <span>Blood Inventory Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {bloodAvailability.map((blood) => (
                  <div key={blood.type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{blood.type}</p>
                      <p className="text-sm text-gray-600">{blood.units} units</p>
                    </div>
                    <Badge
                      variant={blood.status === 'high' ? 'default' : blood.status === 'medium' ? 'secondary' : 'destructive'}
                    >
                      {blood.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/hospital-patients'}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Manage Patients
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/hospital-donors'}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Manage Donors
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/provider-assistant'}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Assistant
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

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