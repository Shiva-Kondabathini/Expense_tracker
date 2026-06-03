import { NavLink } from "react-router-dom";

import { FiHome, FiDollarSign, FiBarChart2 } from "react-icons/fi";

export const menus = [
  {
    label: "Dashboard",
    path: "/",
    icon: FiHome,
  },
  {
    label: "Expenses",
    path: "/expenses",
    icon: FiDollarSign,
  },

  {
    label: "Analytics",
    path: "/analytics",
    icon: FiBarChart2,
  },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:block w-64 border-r border-slate-800 bg-slate-950">
      <div className="p-6 text-2xl font-bold">NaKharch</div>

      <nav className="flex flex-col gap-2 p-4">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <NavLink
              key={menu.path}
              to={menu.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  isActive
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              <span>{menu.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
