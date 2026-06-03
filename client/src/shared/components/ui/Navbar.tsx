import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { menus } from "./Sidebar";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 text-slate-300"
            onClick={() => setOpen((s) => !s)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>

          <h2 className="text-xl font-semibold">NaKharch</h2>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile topbar menu: shows nav items horizontally when toggled */}
      {open && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950">
          <div className="flex overflow-x-auto px-4 py-3 gap-2">
            {menus.map((menu) => {
              const Icon = menu.icon;

              return (
                <NavLink
                  key={menu.path}
                  to={menu.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 transition whitespace-nowrap ${
                      isActive
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-white"
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{menu.label}</span>
                </NavLink>
              );
            })}
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="ml-2 rounded-lg bg-red-600 px-3 py-2"
            >
              Logout
            </button>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
