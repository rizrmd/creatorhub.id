import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Campaigns from "@/pages/Campaigns";
import CampaignDetail from "@/pages/CampaignDetail";
import Analytics from "@/pages/Analytics";
import MediaMonitoring from "@/pages/MediaMonitoring";
import Messages from "@/pages/Messages";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";
import BoostAds from "@/pages/BoostAds";
import ApplyWizard from "@/pages/ApplyWizard";
import CreatorHome from "@/pages/kreator/CreatorHome";
import CreatorInvitations from "@/pages/kreator/CreatorInvitations";
import CreatorWork from "@/pages/kreator/CreatorWork";
import CreatorEarnings from "@/pages/kreator/CreatorEarnings";
import CreatorInsights from "@/pages/kreator/CreatorInsights";
import CreatorProfile from "@/pages/kreator/CreatorProfile";
import CreatorMessages from "@/pages/kreator/CreatorMessages";
import CreatorSettings from "@/pages/kreator/CreatorSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<ApplyWizard />} />

        {/* Protected — all routes require a valid session */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/marketplace" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="campaigns/:id" element={<CampaignDetail />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="boost-ads" element={<BoostAds />} />
          <Route path="media-monitoring" element={<MediaMonitoring />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="kreator">
            <Route index element={<Navigate to="/kreator/home" replace />} />
            <Route path="home" element={<CreatorHome />} />
            <Route path="invitations" element={<CreatorInvitations />} />
            <Route path="work" element={<CreatorWork />} />
            <Route path="earnings" element={<CreatorEarnings />} />
            <Route path="insights" element={<CreatorInsights />} />
            <Route path="profile" element={<CreatorProfile />} />
            <Route path="messages" element={<CreatorMessages />} />
            <Route path="settings" element={<CreatorSettings />} />
            <Route path="dashboard" element={<Navigate to="/kreator/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
