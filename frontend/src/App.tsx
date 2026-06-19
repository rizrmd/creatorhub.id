import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { BrandRoute, KreatorRoute } from "@/components/RoleRoute";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apply" element={<ApplyWizard />} />

        {/* Protected — all routes require a valid session */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BrandRoute><Dashboard /></BrandRoute>} />
          <Route path="search" element={<BrandRoute><BrandSearch /></BrandRoute>} />
          <Route path="marketplace" element={<BrandRoute><Marketplace /></BrandRoute>} />
          <Route path="homeless-media" element={<BrandRoute><HomelessMedia /></BrandRoute>} />
          <Route path="campaigns" element={<BrandRoute><Campaigns /></BrandRoute>} />
          <Route path="campaigns/:id" element={<BrandRoute><CampaignDetail /></BrandRoute>} />
          <Route path="analytics" element={<BrandRoute><Analytics /></BrandRoute>} />
          <Route path="boost-ads" element={<BrandRoute><BoostAds /></BrandRoute>} />
          <Route path="media-monitoring" element={<BrandRoute><MediaMonitoring /></BrandRoute>} />
          <Route path="messages" element={<BrandRoute><Messages /></BrandRoute>} />
          <Route path="payments" element={<BrandRoute><Payments /></BrandRoute>} />
          <Route path="settings" element={<BrandRoute><Settings /></BrandRoute>} />
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

        {/* Legacy redirects */}
        <Route path="/marketplace" element={<Navigate to="/dashboard/marketplace" replace />} />
        <Route path="/campaigns" element={<Navigate to="/dashboard/campaigns" replace />} />
        <Route path="/analytics" element={<Navigate to="/dashboard/analytics" replace />} />
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
