import { Link, useLocation } from "wouter";
import { Bell, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authService, type AuthUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";

interface NavigationProps {
  user: AuthUser;
}

export function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ['/api/notifications/user', user.id],
    enabled: !!user.id,
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  const handleLogout = () => {
    authService.logout();
    window.location.reload();
  };

  const getNavItems = () => {
    switch (user.role) {
      case 'patient':
        return [
          { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
          { href: '/family', label: 'My Family', active: location === '/family' },
          { href: '/schedule', label: 'Schedule', active: location === '/schedule' },
          { href: '/health', label: 'Health Data', active: location === '/health' },
          { href: '/education', label: 'Education', active: location === '/education' },
        ];
      case 'donor':
        return [
          { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
          { href: '/donations', label: 'My Donations', active: location === '/donations' },
          { href: '/schedule', label: 'Schedule', active: location === '/schedule' },
          { href: '/badges', label: 'Badges', active: location === '/badges' },
        ];
      case 'healthcare_provider':
        return [
          { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
          { href: '/patients', label: 'Patients', active: location === '/patients' },
          { href: '/transfusions', label: 'Transfusions', active: location === '/transfusions' },
          { href: '/donors', label: 'Donors', active: location === '/donors' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-primary">BloodConnect</h1>
            </div>
            <div className="hidden md:flex space-x-6 ml-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`pb-4 cursor-pointer ${
                      item.active
                        ? 'text-primary font-medium border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center p-0"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}