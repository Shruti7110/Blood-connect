
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { type AuthUser } from "@/lib/auth";

interface ProviderAssistantProps {
  user: AuthUser;
}

export default function ProviderAssistant({ user }: ProviderAssistantProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navigation user={user} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">👨‍⚕️</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Healthcare Provider AI Assistant
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Streamline patient management, track blood inventory, coordinate appointments, 
            and generate comprehensive reports for your healthcare facility.
          </p>
        </div>
        
        <AIAssistant user={user} />
      </div>
    </div>
  );
}
