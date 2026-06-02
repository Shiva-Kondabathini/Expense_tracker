import { Outlet } from "react-router-dom";

import Sidebar from "@/shared/components/ui/Sidebar";
import Navbar from "@/shared/components/ui/Navbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Navbar />

        <main className="flex-1 overflow-auto bg-slate-950 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
