import { useEffect, useState } from "react";
import { authService, type AuthUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthWrapperProps {
  children: (user: AuthUser) => React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      const currentUser = authService.getCurrentUser();
      
      if (currentUser) {
        // Check if user exists in current storage by validating with server
        try {
          const response = await fetch(`/api/users/${currentUser.id}`, { 
            method: 'HEAD' // Just check if user exists without fetching data
          });
          if (response.status === 404) {
            // User doesn't exist, clear invalid session
            authService.clearSession();
            setUser(null);
          } else {
            setUser(currentUser);
          }
        } catch {
          // On error, keep session but will handle later
          setUser(currentUser);
        }
      }
      
      setLoading(false);
    };

    validateSession();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-alt flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return fallback || <div>Please log in</div>;
  }

  return <>{children(user)}</>;
}
