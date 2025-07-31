
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { ScheduleModal } from "@/components/schedule-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Droplet, Plus, CheckCircle, AlertTriangle } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientScheduleProps {
  user: AuthUser;
}

export default function PatientSchedule({ user }: PatientScheduleProps) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  const { data: transfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/patient', patient?.id],
    enabled: !!patient?.id,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'missed': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'scheduled': return Calendar;
      case 'cancelled': return AlertTriangle;
      case 'missed': return AlertTriangle;
      default: return Calendar;
    }
  };

  const upcomingTransfusions = transfusions.filter((t: any) => 
    t.status === "scheduled" && new Date(t.scheduledDate) > new Date()
  );

  const pastTransfusions = transfusions.filter((t: any) => 
    t.status === "completed" || new Date(t.scheduledDate) <= new Date()
  );

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule & Appointments</h1>
            <p className="text-gray-600">Manage your transfusion schedule and view appointment history</p>
          </div>
          <Button onClick={() => setScheduleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Transfusion
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingTransfusions.length > 0 ? (
                  upcomingTransfusions.map((transfusion: any) => {
                    const StatusIcon = getStatusIcon(transfusion.status);
                    return (
                      <div key={transfusion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Droplet className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">Blood Transfusion</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{formatDate(transfusion.scheduledDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{transfusion.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(transfusion.status) as any}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {transfusion.status}
                          </Badge>
                        </div>
                        {transfusion.notes && (
                          <p className="text-sm text-gray-600 mt-3 pl-15">{transfusion.notes}</p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No upcoming appointments scheduled</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setScheduleModalOpen(true)}
                    >
                      Schedule Your Next Transfusion
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointment History */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Appointment History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {pastTransfusions.length > 0 ? (
                  pastTransfusions.map((transfusion: any) => {
                    const StatusIcon = getStatusIcon(transfusion.status);
                    return (
                      <div key={transfusion.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Droplet className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Blood Transfusion</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDate(transfusion.scheduledDate)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{transfusion.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(transfusion.status) as any} className="text-xs">
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {transfusion.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No appointment history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {patient && (
        <ScheduleModal 
          isOpen={scheduleModalOpen} 
          onClose={() => setScheduleModalOpen(false)} 
          patientId={patient.id} 
        />
      )}
    </div>
  );
}
