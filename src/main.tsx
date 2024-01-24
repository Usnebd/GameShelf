import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Home from "./components/Home";
import Orders from "./components/Orders";
import Menu from "./components/Menu";
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="Menu" element={<Menu />} />
      <Route path="Orders" element={<Orders />} />
      <Route path="page-not-found" element={<NotFound />} />
      <Route path="sign-in" element={<SignIn />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="account" element={<Account />} />
      <Route path="password-reset" element={<PasswordReset />} />
      <Route path="*" element={<Navigate to="/page-not-found" />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
