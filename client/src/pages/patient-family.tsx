import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, MapPin, Droplet, Heart, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientFamilyProps {
  user: AuthUser;
}

export default function PatientFamily({ user }: PatientFamilyProps) {
  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  const { data: familyData } = useQuery<any>({
    queryKey: ['/api/donor-family', patient?.id],
    enabled: !!patient?.id,
  });

  const donorFamily = familyData?.family || [];
  const bloodStock = familyData?.bloodStock;

  const getTimeSince = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donor Family</h1>
              <p className="text-gray-600">Your dedicated blood donors who support your transfusion needs</p>
            </div>
            {bloodStock?.nextAppointment && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-green-600 font-medium">Next Appointment</p>
                    <p className="text-sm font-semibold text-green-700">
                      {formatDate(bloodStock.nextAppointment)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blood Stock Overview */}
        {bloodStock && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Droplet className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Available Units</p>
                    <p className="text-2xl font-bold text-red-600">{bloodStock.totalAvailableUnits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Used</p>
                    <p className="text-2xl font-bold text-blue-600">{bloodStock.totalUnitsUsed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Stock Status</p>
                    <Badge 
                      variant={bloodStock.totalAvailableUnits > 5 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {bloodStock.totalAvailableUnits > 5 ? 'Adequate' : 'Low Stock'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Donor Family Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donorFamily.map((member: any) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-white">
                      {member.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{member.user?.name || 'Unknown Donor'}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">
                        {member.user?.bloodGroup || 'Unknown'}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${
                        member.donor?.availableForDonation ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{member.user?.location || 'Not provided'}</span>
                  </div>
                </div>

                {/* Donation Statistics */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-medium">{member.donor?.total_donations || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Donation:</span>
                    <span className="font-medium">
                      {member.donor?.last_donation ? getTimeSince(member.donor.last_donation) : 'Never'}
                    </span>
                  </div>
                </div>

                


              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {donorFamily.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Donor Family Members</h3>
              <p className="text-gray-600 mb-6">You don't have any assigned donor family members yet.</p>
              <Button>
                <Heart className="w-4 h-4 mr-2" />
                Find Donors
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Transfusions */}
        {bloodStock?.upcomingTransfusions && bloodStock.upcomingTransfusions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Transfusions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bloodStock.upcomingTransfusions.map((transfusion: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{formatDate(transfusion.date)}</p>
                      <p className="text-sm text-gray-600">Scheduled transfusion</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-blue-600">{transfusion.unitsRequired} units</p>
                      <p className="text-xs text-gray-500">Required</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}