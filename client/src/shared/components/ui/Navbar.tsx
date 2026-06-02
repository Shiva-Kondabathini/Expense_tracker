import { useNavigate } from "react-router-dom";
import { logout } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

const Navbar = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">
      <h2 className="text-2xl font-semibold">Welcome Back to Nakharch</h2>

      <button
        onClick={handleLogout}
        className="rounded-lg bg-red-600 px-4 py-2"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
