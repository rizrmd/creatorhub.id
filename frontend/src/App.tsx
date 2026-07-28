import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { BrandRoute, KreatorRoute, MediaMonitoringRoute, EkrafHubRoute } from "@/components/RoleRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ServiceHub from "@/pages/ServiceHub";
import Marketplace from "@/pages/Marketplace";
import CreatorDetail from "@/pages/CreatorDetail";
import CampaignDetail from "@/pages/CampaignDetail";
import Analytics from "@/pages/Analytics";
import ProjectDetail from "@/pages/ProjectDetail";
import MediaMonitoring from "@/pages/MediaMonitoring";
import Messages from "@/pages/Messages";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";
import BoostAds from "@/pages/BoostAds";
import DatabasePage from "@/pages/database/DatabaseHub";
import DatabaseContentCreators from "@/pages/database/ContentCreators";
import DatabaseHomelessMedia from "@/pages/database/HomelessMedia";
import DatabaseLiveShopping from "@/pages/database/LiveShopping";
import DatabasePodcast from "@/pages/database/Podcast";
import DatabaseIndonesianMedia from "@/pages/database/IndonesianMedia";
import DatabaseInternationalMedia from "@/pages/database/InternationalMedia";
import ContentHub from "@/pages/ContentHub";
import AISupport from "@/pages/AISupport";
import HomelessMedia from "@/pages/HomelessMedia";
import ApplyWizard from "@/pages/ApplyWizard";
import CreatorHome from "@/pages/kreator/CreatorHome";
import CreatorInvitations from "@/pages/kreator/CreatorInvitations";
import CreatorInvitationDetail from "@/pages/kreator/CreatorInvitationDetail";
import CreatorWork from "@/pages/kreator/CreatorWork";
import CreatorEarnings from "@/pages/kreator/CreatorEarnings";
import CreatorInsights from "@/pages/kreator/CreatorInsights";
import CreatorProfile from "@/pages/kreator/CreatorProfile";
import CreatorMessages from "@/pages/kreator/CreatorMessages";
import CreatorSettings from "@/pages/kreator/CreatorSettings";
import CreatorSearch from "@/pages/kreator/CreatorSearch";
import BrandSearch from "@/pages/BrandSearch";
import CreatorAcademy from "@/pages/CreatorAcademy";
import EkrafHubDashboard from "@/pages/ekrafhub/EkrafHubDashboard";
import EkrafHubPlaceholder from "@/pages/ekrafhub/EkrafHubPlaceholder";
import DesaKreative from "@/pages/ekrafhub/DesaKreative";
import GampongNusa from "@/pages/ekrafhub/GampongNusa";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<ApplyWizard />} />

        {/* Protected — all routes under /dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BrandRoute><Dashboard /></BrandRoute>} />
          <Route path="service-hub" element={<BrandRoute><ServiceHub /></BrandRoute>} />
          <Route path="search" element={<BrandRoute><BrandSearch /></BrandRoute>} />
          <Route path="marketplace" element={<BrandRoute><Marketplace /></BrandRoute>} />
          <Route path="creators/:id" element={<BrandRoute><CreatorDetail /></BrandRoute>} />
          <Route path="homeless-media" element={<BrandRoute><HomelessMedia /></BrandRoute>} />
          <Route path="campaigns/:id" element={<BrandRoute><CampaignDetail /></BrandRoute>} />
          <Route path="projects" element={<BrandRoute><Analytics /></BrandRoute>} />
          <Route path="projects/:id" element={<BrandRoute><ProjectDetail /></BrandRoute>} />
          <Route path="boost-ads" element={<BrandRoute><BoostAds /></BrandRoute>} />
          <Route path="database" element={<BrandRoute><DatabasePage /></BrandRoute>} />
          <Route path="database/contentcreators" element={<BrandRoute><DatabaseContentCreators /></BrandRoute>} />
          <Route path="database/homelessmedia" element={<BrandRoute><DatabaseHomelessMedia /></BrandRoute>} />
          <Route path="database/liveshopping" element={<BrandRoute><DatabaseLiveShopping /></BrandRoute>} />
          <Route path="database/podcast" element={<BrandRoute><DatabasePodcast /></BrandRoute>} />
          <Route path="database/indonesianmedia" element={<BrandRoute><DatabaseIndonesianMedia /></BrandRoute>} />
          <Route path="database/internationalmedia" element={<BrandRoute><DatabaseInternationalMedia /></BrandRoute>} />
          <Route path="creator-hub" element={<BrandRoute><ContentHub /></BrandRoute>} />
          <Route path="media-monitoring" element={<MediaMonitoringRoute><MediaMonitoring /></MediaMonitoringRoute>} />
          <Route path="ai-support" element={<BrandRoute><AISupport /></BrandRoute>} />
          <Route path="creator-academy" element={<CreatorAcademy />} />
          <Route path="messages" element={<BrandRoute><Messages /></BrandRoute>} />
          <Route path="payments" element={<BrandRoute><Payments /></BrandRoute>} />
            <Route path="settings" element={<BrandRoute><Settings /></BrandRoute>} />
          <Route path="ekrafhub">
            <Route index element={<EkrafHubRoute><EkrafHubDashboard /></EkrafHubRoute>} />
            <Route path="desa-kreative" element={<EkrafHubRoute><DesaKreative /></EkrafHubRoute>} />
            <Route path="desa-kreative/gampongnusa" element={<EkrafHubRoute><GampongNusa /></EkrafHubRoute>} />
            <Route path="creative-hub" element={<EkrafHubRoute><EkrafHubPlaceholder title="Creative Hub" description="Creative hub management - Coming soon" /></EkrafHubRoute>} />
            <Route path="creative-indonesia" element={<EkrafHubRoute><EkrafHubPlaceholder title="Creative by Indonesia" description="Indonesian creative content - Coming soon" /></EkrafHubRoute>} />
            <Route path="marketplace" element={<EkrafHubRoute><Marketplace /></EkrafHubRoute>} />
            <Route path="boost-ads" element={<EkrafHubRoute><BoostAds /></EkrafHubRoute>} />
            <Route path="media-monitoring" element={<EkrafHubRoute><MediaMonitoring /></EkrafHubRoute>} />
            <Route path="settings" element={<EkrafHubRoute><Settings /></EkrafHubRoute>} />
          </Route>
          <Route path="kreator">
            <Route index element={<Navigate to="/dashboard/kreator/home" replace />} />
            <Route path="home" element={<KreatorRoute><CreatorHome /></KreatorRoute>} />
            <Route path="search" element={<KreatorRoute><CreatorSearch /></KreatorRoute>} />
            <Route path="invitations" element={<KreatorRoute><CreatorInvitations /></KreatorRoute>} />
            <Route path="invitations/:id" element={<KreatorRoute><CreatorInvitationDetail /></KreatorRoute>} />
            <Route path="work" element={<KreatorRoute><CreatorWork /></KreatorRoute>} />
            <Route path="earnings" element={<KreatorRoute><CreatorEarnings /></KreatorRoute>} />
            <Route path="insights" element={<KreatorRoute><CreatorInsights /></KreatorRoute>} />
            <Route path="profile" element={<KreatorRoute><CreatorProfile /></KreatorRoute>} />
            <Route path="messages" element={<KreatorRoute><CreatorMessages /></KreatorRoute>} />
            <Route path="settings" element={<KreatorRoute><CreatorSettings /></KreatorRoute>} />
            <Route path="dashboard" element={<Navigate to="/dashboard/kreator/home" replace />} />
          </Route>
        </Route>

        {/* Legacy redirects — old /service-hub/* URLs */}
        <Route path="/service-hub/*" element={<ServiceHubRedirect />} />
        <Route path="/marketplace" element={<Navigate to="/dashboard/marketplace" replace />} />
        <Route path="/campaigns" element={<Navigate to="/dashboard/campaigns" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/projects" replace />} />
        <Route path="/messages" element={<Navigate to="/dashboard/messages" replace />} />
        <Route path="/payments" element={<Navigate to="/dashboard/payments" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/media-monitoring" element={<Navigate to="/dashboard/media-monitoring" replace />} />
        <Route path="/boost-ads" element={<Navigate to="/dashboard/boost-ads" replace />} />
        <Route path="/homeless-media" element={<Navigate to="/dashboard/homeless-media" replace />} />
        <Route path="/search" element={<Navigate to="/dashboard/search" replace />} />
        <Route path="/kreator/*" element={<Navigate to="/dashboard/kreator" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

/** Handles legacy /service-hub/* redirects to /dashboard/* */
function ServiceHubRedirect() {
  const path = window.location.pathname.replace("/service-hub", "") || "";
  return <Navigate to={`/dashboard${path}`} replace />;
}
