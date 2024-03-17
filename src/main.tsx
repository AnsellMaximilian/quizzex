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
import { Toaster } from "./components/ui/toaster";
import ListBattleResult from "./pages/ListBattleResult";
import ErrorPage from "./pages/ErrorPage";
import AuthRoute from "./components/AuthRoute";
import { UserContextProvider } from "./contexts/UserContext";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "/waiting-room",
        element: (
          <AuthRoute>
            <WaitingRoom />
          </AuthRoute>
        ),
      },
      {
        path: "/list-battle/:id",
        element: <ListBattle />,
      },

      {
        path: "/list-battle-result/:id",
        element: <ListBattleResult />,
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
          <UserContextProvider>
            <RouterProvider router={router} />
          </UserContextProvider>
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
    <Toaster />
  </React.StrictMode>
);
