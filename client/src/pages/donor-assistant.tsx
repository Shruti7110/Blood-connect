
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { type AuthUser } from "@/lib/auth";

interface DonorAssistantProps {
  user: AuthUser;
}

export default function DonorAssistant({ user }: DonorAssistantProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
      <Navigation user={user} />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <span className="text-2xl">🩸</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Donor AI Assistant
            </h2>
          </div>          
        </div>
        
        <AIAssistant user={user} />
      </div>
    </div>
  );
}
