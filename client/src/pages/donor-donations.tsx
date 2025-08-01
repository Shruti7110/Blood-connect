
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Droplet, Calendar, MapPin, Heart, AlertCircle, X } from "lucide-react";
import { type AuthUser } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

interface DonorDonationsProps {
  user: AuthUser;
}

export default function DonorDonations({ user }: DonorDonationsProps) {
  const queryClient = useQueryClient();

  const { data: donor } = useQuery<any>({
    queryKey: ['/api/donors/user', user.id],
    enabled: !!user.id,
  });

  const { data: donations = [] } = useQuery<any[]>({
    queryKey: ['/api/donations/donor', donor?.id],
    enabled: !!donor?.id,
  });

  const cancelDonationMutation = useMutation({
    mutationFn: async (donationId: string) => {
      const response = await fetch(`/api/donations/${donationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      if (!response.ok) throw new Error('Failed to cancel appointment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/donations/donor', donor?.id] });
      toast({ title: "Appointment cancelled successfully" });
    },
    onError: () => {
      toast({ title: "Failed to cancel appointment", variant: "destructive" });
    },
  });

  // Parse donation history from donor data - handle both string, object and array formats
  const donationHistory = (() => {
    if (!donor?.donation_history) return [];
    
    // If it's already an array, return it
    if (Array.isArray(donor.donation_history)) {
      return donor.donation_history;
    }
    
    // If it's an object (not stringified), return it as array
    if (typeof donor.donation_history === 'object') {
      return Array.isArray(donor.donation_history) ? donor.donation_history : [];
    }
    
    // If it's a string, try to parse it
    if (typeof donor.donation_history === 'string') {
      try {
        const parsed = JSON.parse(donor.donation_history);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn('Failed to parse donation history:', error);
        return [];
      }
    }
    
    return [];
  })();
  
  const upcomingDonations = donations.filter((d: any) => 
    d.status === "scheduled" && new Date(d.scheduled_date) > new Date()
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Donations</h1>
          <p className="text-gray-600">Track your donation history and upcoming appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Donations */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Upcoming Donations</h3>
                  <Badge variant="secondary">{upcomingDonations.length}</Badge>
                </div>
                
                <div className="space-y-4">
                  {upcomingDonations.length > 0 ? (
                    upcomingDonations.map((donation: any) => (
                      <div key={donation.id} className="p-4 bg-secondary/5 rounded-lg border border-secondary/20">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center mr-3">
                              <Droplet className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Blood Donation</h4>
                              <p className="text-sm text-gray-600">{formatDateTime(donation.scheduled_date)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelDonationMutation.mutate(donation.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          {donation.location}
                        </div>
                        {donation.notes && (
                          <p className="text-sm text-gray-500">{donation.notes}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No upcoming donations scheduled</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation History */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Donation History</h3>
                  <Badge variant="outline">{donationHistory.length} donations</Badge>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {donationHistory.length > 0 ? (
                    donationHistory.map((donation: any, index: number) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                              <Heart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800">Blood Donation</h4>
                              <p className="text-sm text-gray-600">{formatDate(donation.date)}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {donation.units_donated} unit{donation.units_donated !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {donation.location}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">Hemoglobin:</span> {donation.health_check?.hemoglobin}
                            </div>
                            <div>
                              <span className="font-medium">BP:</span> {donation.health_check?.blood_pressure}
                            </div>
                            <div>
                              <span className="font-medium">Pulse:</span> {donation.health_check?.pulse}
                            </div>
                            <div>
                              <span className="font-medium">Temperature:</span> {donation.health_check?.temperature}
                            </div>
                          </div>
                          
                          {donation.notes && (
                            <div className="flex items-start text-sm text-amber-600 bg-amber-50 p-2 rounded">
                              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                              {donation.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Droplet className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No donation history available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
