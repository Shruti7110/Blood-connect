import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthWrapper } from "@/components/auth-wrapper";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import PatientDashboard from "@/pages/patient-dashboard";
import PatientFamily from "@/pages/patient-family";
import PatientSchedule from "@/pages/patient-schedule";
import PatientHealth from "@/pages/patient-health";
import PatientEducation from "@/pages/patient-education";
import DonorDashboard from "@/pages/donor-dashboard";
import ProviderDashboard from "./pages/provider-dashboard";

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
            if (user.role === 'healthcare_provider') return <ProviderDashboard user={user} />;
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
          <Route path="/">
            {user.role === 'patient' && <PatientDashboard user={user} />}
            {user.role === 'donor' && <DonorDashboard user={user} />}
            {user.role === 'healthcare_provider' && <ProviderDashboard user={user} />}
          </Route>

          {/* Role-specific routes */}
          {user.role === 'patient' && (
            <>
              <Route path="/family" component={() => <PatientFamily user={user} />} />
              <Route path="/schedule" component={() => <PatientSchedule user={user} />} />
              <Route path="/health" component={() => <PatientHealth user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
            </>
          )}

          {user.role === 'donor' && (
            <>
              <Route path="/donations" component={() => <DonorDashboard user={user} />} />
              <Route path="/schedule" component={() => <DonorDashboard user={user} />} />
              <Route path="/badges" component={() => <DonorDashboard user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
            </>
          )}

          {user.role === 'healthcare_provider' && (
            <>
              <Route path="/patients" component={() => <ProviderDashboard user={user} />} />
              <Route path="/transfusions" component={() => <ProviderDashboard user={user} />} />
              <Route path="/donors" component={() => <ProviderDashboard user={user} />} />
              <Route path="/education" component={() => <PatientEducation user={user} />} />
            </>
          )}

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