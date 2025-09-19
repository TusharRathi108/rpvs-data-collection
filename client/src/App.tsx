//* package imports
import { Toaster } from "sonner";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//*  file imports
import rootRouter from "@/routes/root.route";
import { RouterProvider } from "react-router";
import { type RootState } from "@/store/store";
import { setUser } from "@/store/slices/auth-slice";

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [sessionChecked, setSessionChecked] = useState(false);

  console.log("First Log: ", user);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.records) {
          dispatch(
            setUser({
              user_id: data.records.user_id,
              username: data.records.username,
              email: data.records.email,
              role_name: data.records.role_name,
              district_code: data.records.district_code,
              district_name: data.records.district_name,
              state_code: data.records.state_code,
              state_name: data.records.state_name,
              district: data.records.district,
            })
          );
        }
      })
      .catch((err) => {
        console.error("Session check error:", err);
      })
      .finally(() => {
        setSessionChecked(true);
      });
  }, [dispatch]);

  if (!sessionChecked) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={rootRouter} />
    </>
  );
};

export default App;
