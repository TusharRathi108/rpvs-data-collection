//* package imports
import { createBrowserRouter } from "react-router";

//* file imports
import HomePage from "@/pages/home.page";
import LoginPage from "@/pages/login.page";
import ProtectedRoute from "@/components/protected-route";

const rootRouter = createBrowserRouter([
    {
        path: "/",
        Component: LoginPage
    },
    {
        Component: ProtectedRoute,
        children: [
            {
                path: "/homepage",
                Component: HomePage,
            },
        ],
    },
]);

export default rootRouter;