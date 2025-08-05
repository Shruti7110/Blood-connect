
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Calendar, Users } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientAssistantProps {
  user: AuthUser;
}

export default function PatientAssistant({ user }: PatientAssistantProps) {
  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Patient Care Assistant</h1>
          <p className="text-xl text-gray-600">Your personal health companion for thalassemia care</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Health Monitoring</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">24/7</div>
              <p className="text-xs text-blue-600">AI-powered health tracking</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Appointment Support</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">Smart</div>
              <p className="text-xs text-blue-600">Intelligent scheduling assistance</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Care Coordination</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">Connected</div>
              <p className="text-xs text-blue-600">Seamless care team integration</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant */}
        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardContent className="p-6">
            <AIAssistant
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
              userRole={user.role}
              patientId={patient?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
