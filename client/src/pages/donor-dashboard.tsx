import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Droplet, Heart, Award, Clock, CheckCircle, MapPin, User, Phone } from "lucide-react";
import { type AuthUser } from "@/lib/auth";
import { DonorScheduleModal } from "@/components/donor-schedule-modal";

interface DonorDashboardProps {
  user: AuthUser;
}

export default function DonorDashboard({ user }: DonorDashboardProps) {
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const { data: donor } = useQuery<any>({
    queryKey: ['/api/donors/user', user.id],
    enabled: !!user.id,
  });

  const { data: donations = [] } = useQuery<any[]>({
    queryKey: ['/api/donations/donor', donor?.id],
    enabled: !!donor?.id,
  });

  const { data: transfusions = [] } = useQuery<any[]>({
    queryKey: ['/api/transfusions/donor', donor?.id],
    enabled: !!donor?.id,
  });

  const { data: myPatients = [] } = useQuery<any[]>({
    queryKey: ['/api/donor-families', donor?.id],
    enabled: !!donor?.id,
  });

  const upcomingDonations = donations.filter((d: any) => {
    const donationDate = new Date(d.scheduled_date);
    return d.status === "scheduled" && donationDate > new Date();
  });

  const completedDonations = transfusions.filter((t: any) => 
    t.status === "completed"
  );

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

  // Calculate badges based on real donation history and assignment data
  const getBadges = () => {
    const badges = [];
    const totalDonations = donationHistory.length;
    const isAssignedToPatient = myPatients.length > 0;
    
    // Check if donor is regular (donates every 4 months)
    const isRegularDonor = donationHistory.length >= 3 && (() => {
      if (donationHistory.length < 2) return false;
      
      // Sort donations by date
      const sortedDonations = [...donationHistory].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Check if recent donations are within 4-month intervals
      for (let i = 0; i < Math.min(3, sortedDonations.length - 1); i++) {
        const current = new Date(sortedDonations[i].date);
        const next = new Date(sortedDonations[i + 1].date);
        const monthsDiff = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsDiff > 6) return false; // More than 6 months gap
      }
      return true;
    })();

    // First Donation badge
    if (totalDonations >= 1) {
      badges.push({ 
        name: "First Donation", 
        icon: Award, 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        achieved: true 
      });
    }

    // Lifesaver badge (assigned to patient)
    if (isAssignedToPatient) {
      badges.push({ 
        name: "Lifesaver", 
        icon: Heart, 
        color: "bg-red-100 text-red-800 border-red-200",
        achieved: true 
      });
    }

    // Regular Donor badge
    if (isRegularDonor) {
      badges.push({ 
        name: "Regular Donor", 
        icon: Droplet, 
        color: "bg-blue-100 text-blue-800 border-blue-200",
        achieved: true 
      });
    }

    // Hero badge (10+ donations)
    if (totalDonations >= 10) {
      badges.push({ 
        name: "Hero", 
        icon: Award, 
        color: "bg-purple-100 text-purple-800 border-purple-200",
        achieved: true 
      });
    }

    return badges;
  };

  const badges = getBadges();

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
                    : "Thank you for your commitment to saving lives. Schedule your next donation."
                  }
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-4">
                <div className="text-center">
                  <p className="text-3xl font-bold">{donationHistory.length}</p>
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

        {/* Schedule Appointment Button with Badges */}
        <div className="mb-8 flex items-center gap-4 flex-wrap">
          <Button 
            onClick={() => setScheduleModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-lg"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Schedule Appointment
          </Button>
          
          {/* Achievement Badges */}
          {badges.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-600 font-medium">Achievements:</span>
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                return (
                  <div key={index} className={`flex items-center px-3 py-1 rounded-full border text-sm font-medium ${badge.color}`}>
                    <IconComponent className="w-4 h-4 mr-1" />
                    {badge.name}
                  </div>
                );
              })}
            </div>
          )}
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
                          <p className="text-sm text-gray-600">{formatDate(donation.scheduled_date)}</p>
                          <p className="text-sm text-secondary">{donation.location}</p>
                        </div>
                        <Badge variant="destructive">Scheduled</Badge>
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

          {/* Patient Info & Badges */}
          <div className="space-y-6">
            {/* Patient You're Helping */}
            <Card className="ring-2 ring-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-primary" />
                  Patient You're Helping
                </h3>

                <div className="space-y-4">
                  {myPatients.length > 0 ? (
                    myPatients.slice(0, 1).map((patient: any) => (
                      <div key={patient.id} className="p-4 bg-white rounded-lg border-2 border-primary/30 shadow-sm">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{patient.name || patient.users?.name || 'Patient'}</h4>
                            <p className="text-sm text-gray-600">Blood Group: {patient.bloodGroup || patient.users?.blood_group || 'Unknown'}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Condition:</span>
                            <span className="font-medium">Thalassemia</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">{patient.location || patient.users?.location || 'Not specified'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Transfusion:</span>
                            <span className="font-medium">{patient.lastTransfusion ? getTimeSince(patient.lastTransfusion) : 'Not available'}</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-white rounded border">
                          <p className="text-sm text-gray-700">
                            "Thanks to donors like you, I can live a normal life. Your generosity means everything to my family and me."
                          </p>
                          <p className="text-xs text-gray-500 mt-2">- Patient's message</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium mb-2">No patients assigned yet</p>
                      <p className="text-sm">You will be assigned to patients who need your blood type soon.</p>
                      <p className="text-sm mt-2 text-primary">Our matching system runs weekly to connect you with patients in your area.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>

      <DonorScheduleModal 
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        donorId={donor?.id}
      />
    </div>
  );
}