import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import SidebarDesktop from "./SidebarDesktop";
import SidebarMobile from "./SidebarMobile";
import LayoutHeader from "./LayoutHeader";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.startsWith("/dashboard")) return "Dashboard";
    if (location.pathname.startsWith("/project")) return "Mis Proyectos";
    if (location.pathname.startsWith("/settings")) return "Configuración";
    return "NouTeam";
  };

  return (
    <div className="relative min-h-screen flex bg-black">
      <SidebarDesktop />
      <SidebarMobile open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col relative z-10">
        <LayoutHeader title={getTitle()} onOpenSidebar={() => setOpen(true)} />

        <main className="p-6 flex-1 overflow-auto">
          <h1 className="hidden md:block text-2xl font-bold mb-4 text-gray-800">
            {getTitle()}
          </h1>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
