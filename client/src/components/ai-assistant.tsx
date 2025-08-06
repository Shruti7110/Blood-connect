import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

interface AIAssistantProps {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  donorId?: string;
  patientId?: string;
  providerId?: string;
}

export function AIAssistant({
  userId,
  userName,
  userEmail,
  userRole,
  donorId,
  patientId,
  providerId,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${userName}! I'm your AI assistant. I can help you with scheduling appointments, checking your history, and answering questions about blood donation and transfusion. How can I assist you today?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          userData: {
            userId,
            userName,
            userEmail,
            userRole,
            donorId,
            patientId,
            providerId,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "donor":
        return "bg-green-50 border-green-200";
      case "patient":
        return "bg-blue-50 border-blue-200";
      case "healthcare_provider":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case "donor":
        return "💚";
      case "patient":
        return "💙";
      case "healthcare_provider":
        return "💜";
      default:
        return "🤖";
    }
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case "donor":
        return "Donor Assistant";
      case "patient":
        return "Patient Assistant";
      case "healthcare_provider":
        return "Provider Assistant";
      default:
        return "AI Assistant";
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Card className={`flex-1 flex flex-col ${getRoleColor()}`}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-xl">
            <span className="text-2xl">{getRoleIcon()}</span>
            <span>{getRoleTitle()}</span>
            <Badge variant="secondary" className="ml-2">
              {userRole ? userRole.replace("_", " ").toUpperCase() : "USER"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className={`flex-1 flex flex-col p-0 ${getRoleColor()}`}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-12"
                      : "bg-white border mr-12"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === "assistant" && (
                      <Bot className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    {message.sender === "user" && (
                      <User className="w-5 h-5 mt-0.5 text-primary-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.text}
                      </p>
                      <p className={`text-xs mt-2 ${
                        message.sender === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border rounded-lg p-4 shadow-sm mr-12">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}