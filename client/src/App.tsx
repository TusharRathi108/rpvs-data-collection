//* package imports
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";

//*  file imports
import { Toaster } from "sonner";
import rootRouter from "@/routes/root.route";
import { setUser } from "@/store/slices/auth-slice";
// import { useCurrentUser } from "@/hooks/useCurrentUser";

const App = () => {
  const dispatch = useDispatch();
  // const { user } = useCurrentUser();
  const [sessionChecked, setSessionChecked] = useState(false);

  // console.log("First Log: ", user);

  useEffect(() => {
    fetch(`http://10.147.8.150:3000/api/v1/auth/me`, {
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
