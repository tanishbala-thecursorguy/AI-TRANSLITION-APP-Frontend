import { createBrowserRouter, Navigate } from "react-router";
import { MainLayout } from "./components/layout/MainLayout";
import { PlaygroundPage } from "./components/pages/PlaygroundPage";
import { StatusPage } from "./components/pages/StatusPage";
import { EditingPage } from "./components/pages/EditingPage";
import { UsagePage } from "./components/pages/UsagePage";
import { BillingPage } from "./components/pages/BillingPage";
import { SupportPage } from "./components/pages/SupportPage";
import { AccountPage } from "./components/pages/AccountPage";
import { CompletedPage } from "./components/pages/CompletedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, element: <Navigate to="/playground" replace /> },
      { path: "playground", Component: PlaygroundPage },
      { path: "status", Component: StatusPage },
      { path: "completed", Component: CompletedPage },
      { path: "editing/:id", Component: EditingPage },
      { path: "usage", Component: UsagePage },
      { path: "billing", Component: BillingPage },
      { path: "support", Component: SupportPage },
      { path: "account", Component: AccountPage },
    ],
  },
]);