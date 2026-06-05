import { useNavigate, NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { logout } from "@/features/auth/authSlice";
import { resetExpenses } from "@/features/expenses/expensesSlice";
import { useAppDispatch } from "@/store/hooks";
import { menus } from "./Sidebar";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetExpenses());
    dispatch(logout());

    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">NaKharch</h2>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-300 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-200 md:hidden"
          aria-label="Logout"
        >
          <FiLogOut size={18} />
        </button>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2"
          >
            Logout
          </button>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-800 bg-slate-950/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <NavLink
                key={menu.path}
                to={menu.path}
                className={({ isActive }) =>
                  `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition ${
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
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
