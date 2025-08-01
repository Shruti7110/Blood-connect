import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, User, Droplet, Users } from "lucide-react";
import { type AuthUser } from "@/lib/auth";

interface HospitalDonorsProps {
  user: AuthUser;
}

export default function HospitalDonors({ user }: HospitalDonorsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: provider } = useQuery<any>({
    queryKey: ['/api/providers/user', user.id],
    enabled: !!user.id,
  });

  const { data: upcomingDonations } = useQuery<any[]>({
    queryKey: ['/api/donations/upcoming'],
    enabled: !!provider,
  });

  const { data: donors } = useQuery<any[]>({
    queryKey: ['/api/donors'],
    enabled: !!provider,
  });

  // Filter upcoming donation appointments for this hospital
  const hospitalName = provider?.hospital_name || provider?.hospitalName;
  const hospitalDonations = upcomingDonations?.filter(d => {
    const isAtThisHospital = hospitalName && d.location?.includes(hospitalName);
    const isUpcoming = new Date(d.scheduledDate || d.scheduled_date) > new Date();
    return isAtThisHospital && isUpcoming;
  }) || [];

  // Filter donors based on search term
  const filteredDonors = donors?.filter(donor =>
    donor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.user?.bloodGroup?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Check if donor is part of any family (this would need to be implemented in the API)
  const getDonorFamilyStatus = (donorId: string) => {
    // This is a placeholder - you would need to implement this API endpoint
    // For now, we'll simulate some donors being part of families
    const isPartOfFamily = Math.random() > 0.3; // 70% chance of being part of a family
    return isPartOfFamily;
  };

  return (
    <div className="min-h-screen bg-background-alt">
      <Navigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Donors</h1>
          <p className="text-gray-600">{provider?.hospital_name || provider?.hospitalName || 'Hospital'} - Donor Management</p>
        </div>

        {/* Upcoming Donor Appointments */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-red-500" />
              <span>Upcoming Donor Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hospitalDonations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming donation appointments</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitalDonations.map((donation) => (
                  <div key={donation.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <Droplet className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">{donation.donor?.user?.name || 'Unknown Donor'}</p>
                        <p className="text-sm text-gray-600">{formatDateTime(donation.scheduledDate || donation.scheduled_date)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {donation.donor?.user?.bloodGroup || 'Unknown'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {donation.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Donor Search and List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-green-500" />
              <span>All Donors</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search donors by name, email, or blood group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDonors.map((donor) => {
                const isPartOfFamily = getDonorFamilyStatus(donor.id);
                return (
                  <Card key={donor.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">
                            {donor.user?.name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{donor.user?.name}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {donor.user?.bloodGroup}
                            </Badge>
                            <span className={`w-3 h-3 rounded-full ${
                              donor.availableForDonation ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span>{donor.user?.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-right text-xs">{donor.user?.location || 'Not provided'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Donations:</span>
                          <span>{donor.totalDonations || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Donation:</span>
                          <span className="text-xs">
                            {donor.lastDonation ? formatDateTime(donor.lastDonation) : 'Never'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Family Status:</span>
                          <Badge 
                            variant={isPartOfFamily ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {isPartOfFamily ? 'Part of Family' : 'Not Assigned'}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Availability:</span>
                          <Badge 
                            variant={donor.availableForDonation ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {donor.availableForDonation ? 'Available' : 'Not Available'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredDonors.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No donors found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}