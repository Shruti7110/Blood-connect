
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Users, Activity, Shield } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface ProviderAssistantProps {
  user: AuthUser;
}

export default function ProviderAssistant({ user }: ProviderAssistantProps) {
  const { data: provider } = useQuery<any>({
    queryKey: ['/api/providers/user', user.id],
    enabled: !!user.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Stethoscope className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Healthcare Provider Assistant</h1>
          <p className="text-xl text-gray-600">Advanced tools for comprehensive patient care management</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Patient Management</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">Advanced</div>
              <p className="text-xs text-purple-600">Comprehensive care coordination</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Clinical Intelligence</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">AI-Powered</div>
              <p className="text-xs text-purple-600">Data-driven insights</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Quality Assurance</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">Secure</div>
              <p className="text-xs text-purple-600">HIPAA-compliant operations</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant */}
        <Card className="bg-white/90 backdrop-blur-sm border-purple-200 shadow-xl">
          <CardContent className="p-6">
            <AIAssistant
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
              userRole={user.role}
              providerId={provider?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
