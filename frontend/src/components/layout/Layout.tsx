import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { BreadcrumbProvider } from "@/contexts/BreadcrumbContext";
import { KreatorDataProvider } from "@/context/KreatorDataContext";

export default function Layout() {
  const { pathname } = useLocation();
  const fullHeight = pathname === "/dashboard/messages" || pathname === "/dashboard/kreator/messages";

  return (
    <SidebarProvider>
      <BreadcrumbProvider>
      <KreatorDataProvider>
      <div className="flex h-[100dvh] bg-[#070B14] overflow-hidden">
        <Toaster position="top-right" richColors />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-0 w-full">
          <Header />
          <main className={fullHeight ? "flex-1 min-h-0 overflow-hidden" : "flex-1 min-h-0 overflow-auto"}>
            <Outlet />
          </main>
        </div>
      </div>
      </KreatorDataProvider>
      </BreadcrumbProvider>
    </SidebarProvider>
  );
}
