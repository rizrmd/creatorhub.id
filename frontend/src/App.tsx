import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import { HomeRedirect, BrandRoute, KreatorRoute } from "@/components/RoleRoute";
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
          <Route index element={<HomeRedirect />} />
          <Route path="search" element={<BrandRoute><BrandSearch /></BrandRoute>} />
          <Route path="dashboard" element={<BrandRoute><Dashboard /></BrandRoute>} />
          <Route path="marketplace" element={<BrandRoute><Marketplace /></BrandRoute>} />
          <Route path="campaigns" element={<BrandRoute><Campaigns /></BrandRoute>} />
          <Route path="campaigns/:id" element={<BrandRoute><CampaignDetail /></BrandRoute>} />
          <Route path="analytics" element={<BrandRoute><Analytics /></BrandRoute>} />
          <Route path="boost-ads" element={<BrandRoute><BoostAds /></BrandRoute>} />
          <Route path="media-monitoring" element={<BrandRoute><MediaMonitoring /></BrandRoute>} />
          <Route path="messages" element={<BrandRoute><Messages /></BrandRoute>} />
          <Route path="payments" element={<BrandRoute><Payments /></BrandRoute>} />
          <Route path="settings" element={<BrandRoute><Settings /></BrandRoute>} />
          <Route path="kreator">
            <Route index element={<Navigate to="/kreator/home" replace />} />
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
            <Route path="dashboard" element={<Navigate to="/kreator/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
