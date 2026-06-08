import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Marketplace from "@/pages/Marketplace";
import Campaigns from "@/pages/Campaigns";
import Analytics from "@/pages/Analytics";
import MediaMonitoring from "@/pages/MediaMonitoring";
import Messages from "@/pages/Messages";
import Payments from "@/pages/Payments";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/marketplace" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="media-monitoring" element={<MediaMonitoring />} />
          <Route path="messages" element={<Messages />} />
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
