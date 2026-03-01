import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Repairing } from "./pages/Repairing";
import { BuyAndSell } from "./pages/BuyAndSell";
import { StoreLocator } from "./pages/StoreLocator";
import { Products } from "./pages/Products";
import { AdminLogin } from "./pages/AdminLogin";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "repairing", Component: Repairing },
      { path: "buy-sell", Component: BuyAndSell },
      { path: "stores", Component: StoreLocator },
      { path: "products", Component: Products },
      { path: "admin", Component: AdminLogin },
      { path: "admin/dashboard", Component: Admin },
    ],
  },
]);
