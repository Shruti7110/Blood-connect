import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthWrapper } from "@/components/auth-wrapper";
import Login from "@/pages/login";
import Register from "@/pages/register";
import PatientDashboard from "@/pages/patient-dashboard";
import PatientFamily from "@/pages/patient-family";
import PatientSchedule from "@/pages/patient-schedule";
import PatientHealth from "@/pages/patient-health";
import PatientEducation from "@/pages/patient-education";
import PatientAssistant from "@/pages/patient-assistant";
import DonorAssistant from "@/pages/donor-assistant";
import ProviderAssistant from "@/pages/provider-assistant";
import ProviderDashboard from "@/pages/provider-dashboard";
import HospitalDashboard from "@/pages/hospital-dashboard";
import HospitalPatients from "@/pages/hospital-patients";
import HospitalDonors from "@/pages/hospital-donors";
import DonorDashboard from "@/pages/donor-dashboard";
import DonorDonations from "@/pages/donor-donations";
import NotFound from "@/pages/not-found";

function AuthenticatedRouter() {
  return (
    <AuthWrapper
      fallback={
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Login} />
          <Route component={Login} />
        </Switch>
      }
    >
      {(user) => (
        <Switch>
          <Route path="/login" component={() => <PatientDashboard user={user} />} />
          <Route path="/register" component={() => <PatientDashboard user={user} />} />
          <Route path="/dashboard" component={() => {
            if (user.role === 'patient') return <PatientDashboard user={user} />;
            if (user.role === 'donor') return <DonorDashboard user={user} />;
            if (user.role === 'healthcare_provider') return <HospitalDashboard user={user} />;
            return <NotFound />;
          }} />
          <Route path="/family" component={() => {
            if (user.role === 'patient') return <PatientFamily user={user} />;
            return <NotFound />;
          }} />
          <Route path="/schedule" component={() => {
            if (user.role === 'patient') return <PatientSchedule user={user} />;
            return <NotFound />;
          }} />
          <Route path="/health" component={() => {
            if (user.role === 'patient') return <PatientHealth user={user} />;
            return <NotFound />;
          }} />
          <Route path="/education" component={() => <PatientEducation user={user} />} />
          <Route path="/ai-assistant" component={() => {
            if (user.role === 'patient') return <PatientAssistant user={user} />;
            if (user.role === 'donor') return <DonorAssistant user={user} />;
            if (user.role === 'healthcare_provider') return <ProviderAssistant user={user} />;
            return <NotFound />;
          }} />
          <Route path="/">
            {user.role === 'patient' && <PatientDashboard user={user} />}
            {user.role === 'donor' && <DonorDashboard user={user} />}
            {user.role === 'healthcare_provider' && <HospitalDashboard user={user} />}
          </Route>

          {/* Role-specific routes */}
          {user.role === 'patient' && (
            <>
              <Route path="/family" component={() => <PatientFamily user={user} />} />
              <Route path="/schedule" component={() => <PatientSchedule user={user} />} />
              <Route path="/health" component={() => <PatientHealth user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
              <Route path="/ai-assistant" component={() => <PatientAssistant user={user} />} />
            </>
          )}

          {user.role === 'donor' && (
            <>
              <Route path="/dashboard" component={() => <DonorDashboard user={user} />} />
              <Route path="/donations" component={() => <DonorDonations user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
              <Route path="/ai-assistant" component={() => <DonorAssistant user={user} />} />
            </>
          )}

          {user.role === 'healthcare_provider' && (
            <>
              <Route path="/hospital-patients" component={() => <HospitalPatients user={user} />} />
              <Route path="/hospital-donors" component={() => <HospitalDonors user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
              <Route path="/ai-assistant" component={() => <ProviderAssistant user={user} />} />
            </>
          )}
           <Route path="/donor-assistant" component={() => <DonorAssistant user={user} />} />
              <Route path="/patient-assistant" component={() => <PatientAssistant user={user} />} />
              <Route path="/provider-assistant" component={() => <ProviderAssistant user={user} />} />
          <Route component={NotFound} />
        </Switch>
      )}
    </AuthWrapper>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AuthenticatedRouter />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;