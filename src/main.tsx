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
import Checkout from "./components/Checkout.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="menu" element={<Menu />}>
        <Route path=":category" element={<Menu />}>
          <Route path=":id" element={<Menu />} />
        </Route>
      </Route>
      <Route path="orders" element={<Orders />}>
        <Route path=":id" element={<Orders />} />
      </Route>
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
