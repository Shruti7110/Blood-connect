
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Calendar, Heart, Award } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface DonorAssistantProps {
  user: AuthUser;
}

export default function DonorAssistant({ user }: DonorAssistantProps) {
  const { data: donor } = useQuery<any>({
    queryKey: ['/api/donors/user', user.id],
    enabled: !!user.id,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Droplet className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Donor Support Assistant</h1>
          <p className="text-xl text-gray-600">Your companion for making a life-saving difference</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Donation Scheduling</CardTitle>
              <Calendar className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">Easy</div>
              <p className="text-xs text-green-600">Simplified appointment booking</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Impact Tracking</CardTitle>
              <Heart className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">Lives</div>
              <p className="text-xs text-green-600">Saved through your donations</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Recognition</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">Hero</div>
              <p className="text-xs text-green-600">Community health champion</p>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant */}
        <Card className="bg-white/90 backdrop-blur-sm border-green-200 shadow-xl">
          <CardContent className="p-6">
            <AIAssistant
              userId={user.id}
              userName={user.name}
              userEmail={user.email}
              userRole={user.role}
              donorId={donor?.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
