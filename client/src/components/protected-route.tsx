//* package imports
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import { type RootState } from "@/store/store";

const ProtectedRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
