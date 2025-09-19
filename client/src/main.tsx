//* package imports
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

//* file imports
import "@/index.css";
import App from "@/App";
import { store } from "@/store/store";

createRoot(document.getElementById("root")!).render(
  <>
    <Provider store={store}>
      <App />
    </Provider>
  </>
);
