
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { type AuthUser } from "@/lib/auth";

interface ProviderAssistantProps {
  user: AuthUser;
}

export default function ProviderAssistant({ user }: ProviderAssistantProps) {
  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            Get help with patient management, inventory tracking, and administrative tasks.
          </p>
        </div>
        
        <AIAssistant user={user} />
      </div>
    </div>
  );
}
