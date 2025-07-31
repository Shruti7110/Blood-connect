
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, MapPin, Droplet, Heart } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface PatientFamilyProps {
  user: AuthUser;
}

export default function PatientFamily({ user }: PatientFamilyProps) {
  const { data: patient } = useQuery<any>({
    queryKey: ['/api/patients/user', user.id],
    enabled: !!user.id,
  });

  const { data: donorFamily = [] } = useQuery<any[]>({
    queryKey: ['/api/donor-family', patient?.id],
    enabled: !!patient?.id,
  });

  const getTimeSince = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donor Family</h1>
          <p className="text-gray-600">Your dedicated blood donors who support your transfusion needs</p>
        </div>

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
                    <CardTitle className="text-lg">{member.user?.name || 'Unknown'}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Droplet className="w-4 h-4 text-red-500" />
                      <span className="text-sm font-medium text-red-600">{member.user?.bloodGroup}</span>
                      <span className={`w-3 h-3 rounded-full ${member.donor?.availableForDonation ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-medium">{member.donor?.totalDonations || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Donation:</span>
                    <span className="font-medium">
                      {member.donor?.lastDonation ? getTimeSince(member.donor.lastDonation) : 'Never'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Badge variant={member.donor?.availableForDonation ? "default" : "secondary"}>
                    {member.donor?.availableForDonation ? 'Available' : 'Not Available'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
      </div>
    </div>
  );
}
