import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Droplet, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  UserCheck,
  Calendar,
  Activity,
  Heart,
  Shield
} from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface ProviderDashboardProps {
  user: AuthUser;
}

export default function ProviderDashboard({ user }: ProviderDashboardProps) {
  const { data: provider } = useQuery<any>({
    queryKey: ['/api/providers/user', user.id],
    enabled: !!user.id,
  });

  const { data: patients = [] } = useQuery<any[]>({
    queryKey: ['/api/patients'],
    enabled: !!provider?.id,
  });

  const { data: upcomingTransfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/upcoming'],
    enabled: true, // Don't require provider.id since this is a general endpoint
  });

  const { data: availableDonors = [] } = useQuery<any[]>({
    queryKey: ['/api/donors/available', 'B+'],
    enabled: !!provider?.id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getUrgencyColor = (scheduledDate: string) => {
    const daysDiff = Math.ceil((new Date(scheduledDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysDiff <= 1) return 'destructive';
    if (daysDiff <= 3) return 'secondary';
    return 'default';
  };

  const getUrgencyLabel = (scheduledDate: string) => {
    const daysDiff = Math.ceil((new Date(scheduledDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (daysDiff <= 1) return 'Critical';
    if (daysDiff <= 3) return 'Urgent';
    return 'Scheduled';
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-success to-primary text-white rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome, Dr. {user.name}</h2>
                <p className="text-green-100">
                  {provider?.hospitalName && `${provider.hospitalName} - ${provider.department || 'Medical'}`}
                </p>
                <p className="text-green-100">
                  {upcomingTransfusions.length} transfusions scheduled today. {patients.length} patients under your care.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{patients.length}</p>
                  <p className="text-green-100 text-sm">Active Patients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{upcomingTransfusions.length}</p>
                  <p className="text-green-100 text-sm">Pending Transfusions</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Patient Management</h3>
            <p className="text-gray-600 text-sm">Review patient profiles</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Approve Transfusions</h3>
            <p className="text-gray-600 text-sm">Review and approve requests</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Verify Donors</h3>
            <p className="text-gray-600 text-sm">Check donor eligibility</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Stethoscope className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Medical Records</h3>
            <p className="text-gray-600 text-sm">Access patient data</p>
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="transfusions">Transfusions</TabsTrigger>
            <TabsTrigger value="donors">Donors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Priority Transfusions */}
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Priority Transfusions</h3>
                      <Button variant="ghost" size="sm">View All</Button>
                    </div>
                    
                    <div className="space-y-4">
                      {upcomingTransfusions.slice(0, 3).map((transfusion: any) => (
                        <div key={transfusion.id} className="flex items-center p-4 bg-gray-50 rounded-lg border">
                          <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                            <Droplet className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">Patient Transfusion</h4>
                            <p className="text-sm text-gray-600">{formatDate(transfusion.scheduledDate)}</p>
                            <p className="text-sm text-secondary">{transfusion.location}</p>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={getUrgencyColor(transfusion.scheduledDate) as any}>
                              {getUrgencyLabel(transfusion.scheduledDate)}
                            </Badge>
                            <Button size="sm" variant="outline">Review</Button>
                          </div>
                        </div>
                      ))}
                      
                      {upcomingTransfusions.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No pending transfusions</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* System Status */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">System Status</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Blood Bank Supply</p>
                          <p className="text-lg font-semibold text-gray-800">Adequate</p>
                        </div>
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-success" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Donor Availability</p>
                          <p className="text-lg font-semibold text-gray-800">{availableDonors.length} Available</p>
                        </div>
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Heart className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Emergency Alerts</p>
                          <p className="text-lg font-semibold text-gray-800">None Active</p>
                        </div>
                        <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                          <Shield className="w-6 h-6 text-success" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6">Quick Stats</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-primary/5 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{patients.length}</p>
                        <p className="text-xs text-gray-600">Active Patients</p>
                      </div>
                      
                      <div className="text-center p-3 bg-secondary/5 rounded-lg">
                        <p className="text-2xl font-bold text-secondary">{upcomingTransfusions.length}</p>
                        <p className="text-xs text-gray-600">Pending Reviews</p>
                      </div>
                      
                      <div className="text-center p-3 bg-success/5 rounded-lg">
                        <p className="text-2xl font-bold text-success">{availableDonors.length}</p>
                        <p className="text-xs text-gray-600">Available Donors</p>
                      </div>
                      
                      <div className="text-center p-3 bg-warning/5 rounded-lg">
                        <p className="text-2xl font-bold text-warning">0</p>
                        <p className="text-xs text-gray-600">Emergency Cases</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Patient Management</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input placeholder="Search patients..." className="pl-10 w-64" />
                    </div>
                    <Button>Add Patient</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {patients.map((patient: any) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Patient ID: {patient.id}</p>
                          <p className="text-sm text-gray-600">{patient.diagnosis || 'No diagnosis recorded'}</p>
                          <p className="text-sm text-gray-500">
                            Next transfusion: {patient.nextTransfusionDate ? formatDate(patient.nextTransfusionDate) : 'Not scheduled'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{patient.totalTransfusions || 0} transfusions</Badge>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                  
                  {patients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No patients registered</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfusions" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Transfusion Records</h3>
                  <Button>Schedule New</Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingTransfusions.map((transfusion: any) => (
                    <div key={transfusion.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Transfusion #{transfusion.id}</p>
                          <p className="text-sm text-gray-600">{formatDate(transfusion.scheduledDate)}</p>
                          <p className="text-sm text-gray-500">{transfusion.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getUrgencyColor(transfusion.scheduledDate) as any}>
                          {getUrgencyLabel(transfusion.scheduledDate)}
                        </Badge>
                        <Button size="sm">
                          {transfusion.status === 'scheduled' ? 'Approve' : 'Review'}
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {upcomingTransfusions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No pending transfusions</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donors" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Donor Verification</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input placeholder="Search donors..." className="pl-10 w-64" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {availableDonors.map((donor: any) => (
                    <div key={donor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Donor ID: {donor.id}</p>
                          <p className="text-sm text-gray-600">Total donations: {donor.totalDonations || 0}</p>
                          <p className="text-sm text-gray-500">
                            Last donation: {donor.lastDonation ? formatDate(donor.lastDonation) : 'Never'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={donor.eligibilityStatus ? "default" : "secondary"}>
                          {donor.eligibilityStatus ? 'Eligible' : 'Not Eligible'}
                        </Badge>
                        <Button size="sm" variant="outline">Verify</Button>
                      </div>
                    </div>
                  ))}
                  
                  {availableDonors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No donors available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Transfusion approved</p>
                    <p className="text-sm text-gray-600">Approved transfusion request for Patient #patient-1</p>
                    <p className="text-xs text-gray-500 mt-1">Today at 2:30 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Donor verified</p>
                    <p className="text-sm text-gray-600">Completed eligibility verification for Donor #donor-1</p>
                    <p className="text-xs text-gray-500 mt-1">Today at 1:15 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Patient updated</p>
                    <p className="text-sm text-gray-600">Medical records updated for Patient #patient-1</p>
                    <p className="text-xs text-gray-500 mt-1">Today at 11:45 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
