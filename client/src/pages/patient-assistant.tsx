
import { Navigation } from "@/components/navigation";
import { AIAssistant } from "@/components/ai-assistant";
import { type AuthUser } from "@/lib/auth";

interface PatientAssistantProps {
  user: AuthUser;
}

export default function PatientAssistant({ user }: PatientAssistantProps) {
  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Assistant</h1>
          <p className="text-gray-600">
            Get help with scheduling transfusions, managing your appointments, and understanding your treatment plan.
          </p>
        </div>
        
        <AIAssistant user={user} />
      </div>
    </div>
  );
}
