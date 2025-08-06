import { Link, useLocation } from "wouter";
import { Bell, Heart, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { authService, type AuthUser } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
          { href: '/patient-assistant', label: 'AI Assistant', active: location === '/patient-assistant' },
          { href: '/family', label: 'My Family', active: location === '/family' },
          { href: '/schedule', label: 'Schedule', active: location === '/schedule' },
          { href: '/health', label: 'Health Data', active: location === '/health' },
          { href: '/education', label: 'Education', active: location === '/education' },
        ];
      case 'donor':
        return [
          { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
          { href: '/donor-assistant', label: 'AI Assistant', active: location === '/donor-assistant' },
          { href: '/donations', label: 'My Donations', active: location === '/donations' },
          { href: '/education', label: 'Education', active: location === '/education' },
        ];
      case 'healthcare_provider':
        return [
          { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
          { href: '/provider-assistant', label: 'AI Assistant', active: location === '/provider-assistant' },
          { href: '/hospital-patients', label: 'Patients', active: location === '/hospital-patients' },
          { href: '/hospital-donors', label: 'Donors', active: location === '/hospital-donors' },
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
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-4 h-4" />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                      {notifications.filter(n => !n.isRead).length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Notifications</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-500">No notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 rounded-lg border text-sm ${
                            notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="font-medium">{notification.title}</div>
                          <div className="text-gray-600 mt-1">{notification.message}</div>
                          <div className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">
                      {notifications.length - 5} more notifications...
                    </p>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-3 py-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                </div>
                <DropdownMenuSeparator />
                <div className="px-3 py-2 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Blood Group:</span>
                    <span className="text-sm font-medium">{user.blood_group || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phone:</span>
                    <span className="text-sm font-medium">{user.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Location:</span>
                    <span className="text-sm font-medium">{user.location || 'Not set'}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}