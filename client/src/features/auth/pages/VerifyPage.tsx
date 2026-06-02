import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/shared/services/api";
import toast from "react-hot-toast";

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const hasAttempted = useRef(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify/${token}`);

        toast.success("Email verified successfully. You can now log in.");
      } catch (error) {
        toast.error("Verification failed or token expired");
      } finally {
        setLoading(false);
        navigate("/login");
      }
    };

    if (token && !hasAttempted.current) {
      hasAttempted.current = true;
      verify();
    }
  }, [token, navigate]);

  return <div>{loading ? "Verifying..." : ""}</div>;
};

export default VerifyPage;
