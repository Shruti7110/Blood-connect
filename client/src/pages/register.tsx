import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { PatientDetailsForm } from "@/components/patient-details-form";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    location: "",
    role: "",
    blood_group: "",
  });
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleBasicRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.register({
        email: formData.email,
        password: formData.password,
        role: formData.role as "patient" | "donor" | "healthcare_provider",
        name: formData.name,
        phone: formData.phone || undefined,
        location: formData.location || undefined,
        blood_group: formData.blood_group || undefined,
      });

      setUserId(response.user.id);

      if (formData.role === "patient") {
        setStep(2);
        toast({
          title: "Basic Registration Complete",
          description: "Please provide your medical details for optimal care.",
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Welcome to BloodConnect!",
        });
        setLocation("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePatientDetails = async (patientData: any) => {
    if (!userId) return;

    setLoading(true);
    try {
      // Get patient profile ID
      const patientProfile = await apiRequest(
        "GET",
        `/api/patients/user/${userId}`,
      );

      // Update patient with detailed information
      await apiRequest(
        "PUT",
        `/api/patients/${patientProfile.id}`,
        patientData,
      );

      toast({
        title: "Registration Complete",
        description:
          "Welcome to BloodConnect! Your medical profile has been saved.",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save patient details. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (step === 2 && formData.role === "patient") {
    return (
      <div className="min-h-screen bg-background-alt flex items-center justify-center p-4">
        <PatientDetailsForm onSubmit={handlePatientDetails} loading={loading} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-alt flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">
            BloodConnect
          </CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBasicRegistration} className="space-y-4">
            <div>
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="donor">Donor</SelectItem>
                  <SelectItem value="healthcare_provider">
                    Healthcare Provider
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="City, State"
              />
            </div>

            <div>
              <Label htmlFor="blood_group">Blood Group</Label>
              <Select
                value={formData.blood_group}
                onValueChange={(value) =>
                  handleInputChange("blood_group", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="underline underline-offset-4 hover:text-primary cursor-pointer"
              onClick={() => (window.location.href = "/login")}
            >
              Sign in
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
