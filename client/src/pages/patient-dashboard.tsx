import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { EmergencyModal } from "@/components/emergency-modal";
import { ScheduleModal } from "@/components/schedule-modal";
import { HealthUpdateModal } from "@/components/health-update-modal";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, HeartPulse, Users, AlertTriangle, Droplet, PillBottle, Stethoscope, Clock, CheckCircle, MessageSquare, Calendar } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientDashboardProps {
  user: AuthUser;
}

export default function PatientDashboard({ user }: PatientDashboardProps) {
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [healthModalOpen, setHealthModalOpen] = useState(false);

  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  const { data: donorFamily = [] } = useQuery<any[]>({
    queryKey: ['/api/donor-family', patient?.id],
    enabled: !!patient?.id,
  });

  const { data: transfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/patient', patient?.id],
    enabled: !!patient?.id,
  });

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ['/api/notifications/user', user.id],
    enabled: !!user.id,
  });

  const availableDonors = donorFamily.filter((member: any) => member.donor?.availableForDonation);
  const upcomingTransfusions = transfusions.filter((t: any) => 
    t.status === "scheduled" && new Date(t.scheduledDate) > new Date()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeSince = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-blue-100">
                  {upcomingTransfusions.length > 0 
                    ? `Your next transfusion is scheduled for ${formatDate(upcomingTransfusions[0].scheduledDate)}. Your donor family is ready to support you.`
                    : "Your donor family is standing by to support you. Schedule your next transfusion when needed."
                  }
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{patient?.totalTransfusions || 0}</p>
                  <p className="text-blue-100 text-sm">Total Transfusions</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{donorFamily.length}</p>
                  <p className="text-blue-100 text-sm">Donor Family Members</p>
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
            onClick={() => setScheduleModalOpen(true)}
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <CalendarPlus className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Schedule Transfusion</h3>
            <p className="text-gray-600 text-sm">Book your next appointment</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
            onClick={() => setHealthModalOpen(true)}
          >
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <HeartPulse className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Update Health Data</h3>
            <p className="text-gray-600 text-sm">Log latest lab results</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Contact Donor Family</h3>
            <p className="text-gray-600 text-sm">Send thank you messages</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
            onClick={() => setEmergencyModalOpen(true)}
          >
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Emergency Help</h3>
            <p className="text-gray-600 text-sm">Find urgent blood supply</p>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Schedule</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingTransfusions.length > 0 ? (
                    upcomingTransfusions.map((transfusion: any) => (
                      <div key={transfusion.id} className="flex items-center p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                          <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">Blood Transfusion</h4>
                          <p className="text-sm text-gray-600">{formatDate(transfusion.scheduledDate)}</p>
                          <p className="text-sm text-secondary">{transfusion.location}</p>
                        </div>
                        <Badge variant="destructive">High Priority</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No upcoming appointments scheduled</p>
                    </div>
                  )}

                  {/* Sample ICT reminder */}
                  <div className="flex items-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                      <PillBottle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Iron Chelation Therapy</h4>
                      <p className="text-sm text-gray-600">Today at 2:00 PM</p>
                      <p className="text-sm text-accent">Home Administration</p>
                    </div>
                    <Badge className="bg-accent text-white">Reminder</Badge>
                  </div>

                  {/* Sample health checkup */}
                  <div className="flex items-center p-4 bg-success/5 rounded-lg border border-success/20">
                    <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mr-4">
                      <Stethoscope className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Health Checkup</h4>
                      <p className="text-sm text-gray-600">March 20, 2024 at 9:30 AM</p>
                      <p className="text-sm text-success">Dr. Jennifer Martinez</p>
                    </div>
                    <Badge className="bg-success text-white">Scheduled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donor Family & Health Metrics */}
          <div className="space-y-6">
            {/* Donor Family Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Your Donor Family</h3>
                  <span className="text-sm text-gray-500">{user.bloodGroup}</span>
                </div>
                
                <div className="space-y-4">
                  {donorFamily.slice(0, 3).map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {member.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{member.user?.name || 'Unknown'}</p>
                          <p className="text-sm text-gray-500">
                            Last donated: {member.donor?.lastDonation ? getTimeSince(member.donor.lastDonation) : 'Never'}
                          </p>
                        </div>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${member.donor?.availableForDonation ? 'bg-success' : 'bg-warning'}`}></span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available for next transfusion:</span>
                    <span className="font-medium text-success">{availableDonors.length}/{donorFamily.length}</span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-success h-2 rounded-full" 
                      style={{ width: `${donorFamily.length > 0 ? (availableDonors.length / donorFamily.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  View All Family Members
                </Button>
              </CardContent>
            </Card>

            {/* Health Metrics Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Health Metrics</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Hemoglobin Level</p>
                      <p className="text-lg font-semibold text-gray-800">{patient?.hemoglobinLevel || "N/A"}</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Iron Levels</p>
                      <p className="text-lg font-semibold text-gray-800">{patient?.ironLevels || "N/A"}</p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Last Transfusion</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {patient?.lastTransfusion ? getTimeSince(patient.lastTransfusion) : "Never"}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full mt-6 bg-accent hover:bg-accent/90"
                  onClick={() => setHealthModalOpen(true)}
                >
                  Update Health Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity Feed */}
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
                    <Droplet className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Transfusion completed successfully</p>
                    <p className="text-sm text-gray-600">Received 2 units from Michael K. and Jennifer S.</p>
                    <p className="text-xs text-gray-500 mt-1">February 28, 2024 at 11:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Thank you message sent</p>
                    <p className="text-sm text-gray-600">Appreciation message sent to your donor family</p>
                    <p className="text-xs text-gray-500 mt-1">February 28, 2024 at 12:15 PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Next transfusion scheduled</p>
                    <p className="text-sm text-gray-600">Appointment booked for March 15th with donor notifications sent</p>
                    <p className="text-xs text-gray-500 mt-1">February 25, 2024 at 3:45 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {patient && (
        <>
          <EmergencyModal 
            isOpen={emergencyModalOpen} 
            onClose={() => setEmergencyModalOpen(false)} 
            patientId={patient.id} 
          />
          <ScheduleModal 
            isOpen={scheduleModalOpen} 
            onClose={() => setScheduleModalOpen(false)} 
            patientId={patient.id} 
          />
          <HealthUpdateModal 
            isOpen={healthModalOpen} 
            onClose={() => setHealthModalOpen(false)} 
            patientId={patient.id} 
          />
        </>
      )}
    </div>
  );
}
