import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorBoundary } from "./ErrorBoundary";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Profile";
import WaitingRoom from "./pages/WaitingRoom";
import MainLayout from "./components/layout/MainLayout";
import ListBattle from "./pages/ListBattle";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/waiting-room",
        element: <WaitingRoom />,
      },
      {
        path: "/list-battle/:id",
        element: <ListBattle />,
      },

      {
        path: "",
        element: <App />,
      },
    ],
  },
  {
    path: "/profile",
    element: <Profile />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <RouterProvider router={router} />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
