import ReactDOM from "react-dom/client";
import App, { loader as appLoader } from "./App.tsx";
import "./index.css";
import Home from "./components/Home";
import Orders from "./components/Orders";
import Menu, { loader as menuLoader } from "./components/Menu";
import NotFound from "./components/NotFound";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/SignIn.tsx";
import SignUp from "./components/SignUp.tsx";
import Account from "./components/Account.tsx";
import PasswordReset from "./components/PasswordReset.tsx";
import Checkout from "./components/Checkout.tsx";
import { registerSW } from "virtual:pwa-register";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} loader={appLoader}>
      <Route index element={<Home />} />
      <Route path="menu" element={<Menu />} loader={menuLoader}>
        <Route path=":category" element={<Menu />}>
          <Route path=":id" element={<Menu />} />
        </Route>
      </Route>
      <Route path="orders" element={<Orders />} />
      <Route path="page-not-found" element={<NotFound />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="account" element={<Account />} />
      <Route path="checkout" element={<Checkout />} />
      <Route path="password-reset" element={<PasswordReset />} />
      <Route path="*" element={<Navigate to="/page-not-found" />} />
    </Route>
  )
);

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New App version available. Reload?")) {
      updateSW(true);
    }
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
