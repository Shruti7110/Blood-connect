import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Droplet, Heart, Award, Clock, CheckCircle, MapPin } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface DonorDashboardProps {
  user: AuthUser;
}

export default function DonorDashboard({ user }: DonorDashboardProps) {
  const { data: donor } = useQuery<any>({
    queryKey: ['/api/donors/user', user.id],
    enabled: !!user.id,
  });

  const { data: transfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/donor', donor?.id],
    enabled: !!donor?.id,
  });

  const upcomingDonations = transfusions.filter((t: any) => 
    t.status === "scheduled" && new Date(t.scheduledDate) > new Date()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getTimeSince = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-secondary to-primary text-white rounded-xl p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name}!</h2>
                <p className="text-red-100">
                  {upcomingDonations.length > 0 
                    ? `You have ${upcomingDonations.length} upcoming donation(s). Your patients are counting on you!`
                    : "Thank you for your commitment to saving lives. Check your upcoming donation schedule."
                  }
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{donor?.totalDonations || 0}</p>
                  <p className="text-red-100 text-sm">Total Donations</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold">{upcomingDonations.length}</p>
                  <p className="text-red-100 text-sm">Upcoming Donations</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Check Schedule</h3>
            <p className="text-gray-600 text-sm">View upcoming donations</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Droplet className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Donation History</h3>
            <p className="text-gray-600 text-sm">Track your contributions</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Patient Updates</h3>
            <p className="text-gray-600 text-sm">See how you're helping</p>
          </Button>

          <Button 
            variant="outline" 
            className="p-6 h-auto bg-white hover:shadow-md border border-gray-200 text-left flex flex-col items-start"
          >
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-warning" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">My Badges</h3>
            <p className="text-gray-600 text-sm">View achievements</p>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Donations */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Donations</h3>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                
                <div className="space-y-4">
                  {upcomingDonations.length > 0 ? (
                    upcomingDonations.map((donation: any) => (
                      <div key={donation.id} className="flex items-center p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mr-4">
                          <Droplet className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">Blood Donation</h4>
                          <p className="text-sm text-gray-600">{formatDate(donation.scheduledDate)}</p>
                          <p className="text-sm text-secondary">{donation.location}</p>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No upcoming donations scheduled</p>
                      <p className="text-sm mt-2">You'll be notified when patients need your blood type</p>
                    </div>
                  )}

                  {/* Sample reminder */}
                  <div className="flex items-center p-4 bg-accent/5 rounded-lg border border-accent/20">
                    <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mr-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">Donation Reminder</h4>
                      <p className="text-sm text-gray-600">You're eligible to donate again</p>
                      <p className="text-sm text-accent">It's been 8 weeks since your last donation</p>
                    </div>
                    <Badge className="bg-accent text-white">Available</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donor Stats & Achievements */}
          <div className="space-y-6">
            {/* Donor Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Impact</h3>
                
                <div className="space-y-4">
                  <div className="text-center p-4 bg-secondary/5 rounded-lg">
                    <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-secondary">{(donor?.totalDonations || 0) * 3}</p>
                    <p className="text-sm text-gray-600">Lives Potentially Saved</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">{donor?.totalDonations || 0}</p>
                      <p className="text-xs text-gray-600">Total Donations</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-gray-800">
                        {donor?.lastDonation ? getTimeSince(donor.lastDonation) : 'Never'}
                      </p>
                      <p className="text-xs text-gray-600">Last Donation</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Eligibility Status</span>
                      <span className="flex items-center text-success text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Eligible
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Blood Group</span>
                      <span className="font-medium">{user.bloodGroup}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement Badges */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Achievement Badges</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Sample badges */}
                  <div className="text-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <Award className="w-8 h-8 text-warning mx-auto mb-2" />
                    <p className="text-xs font-medium">First Donation</p>
                  </div>
                  
                  <div className="text-center p-3 bg-success/10 rounded-lg border border-success/20">
                    <Heart className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="text-xs font-medium">Lifesaver</p>
                  </div>
                  
                  <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <Droplet className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs font-medium">Regular Donor</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-100 rounded-lg border border-gray-200 opacity-50">
                    <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-400">Hero</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  View All Badges
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-success" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Donation completed successfully</p>
                    <p className="text-sm text-gray-600">Donated 2 units for Sarah Chen's transfusion</p>
                    <p className="text-xs text-gray-500 mt-1">February 28, 2024 at 10:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-warning" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">New badge earned</p>
                    <p className="text-sm text-gray-600">Congratulations! You've earned the "Lifesaver" badge</p>
                    <p className="text-xs text-gray-500 mt-1">February 28, 2024 at 11:00 AM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">Upcoming donation reminder</p>
                    <p className="text-sm text-gray-600">You have a scheduled donation on March 15th</p>
                    <p className="text-xs text-gray-500 mt-1">February 25, 2024 at 9:00 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
