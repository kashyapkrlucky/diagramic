import React from "react";

import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "./ErrorBoundary";
import AppLayout from "./Layout";
import PageLoader from "../shared/components/loaders/PageLoader";
import { ProtectedRoute } from "./ProtectedRoute";

// Lazy-loaded Pages

const HomeRoute = React.lazy(() => import("../pages/Home"));
const EditorRoute = React.lazy(() => import("../pages/Editor"));
const SignInRoute = React.lazy(() => import("../pages/SignIn"));
const NotFound = lazy(() => import("./NotFound"));

// Type for our route configuration
interface RouteConfig {
  path: string;
  element: ReactNode;
  children?: RouteConfig[];
  protected?: boolean;
  guestOnly?: boolean;
}

// Route configuration
// Update the route configuration in App.tsx
const routeConfig: RouteConfig[] = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <HomeRoute />,
        protected: true,
      },
      {
        path: "/editor/:id",
        element: <EditorRoute />,
        protected: true,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignInRoute />,
    guestOnly: true,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const createRouteElement = (route: RouteConfig) => {
  // Create the element with Suspense and ErrorBoundary
  const element = (
    <Suspense fallback={<PageLoader />}>
      <ErrorBoundary>{route.element}</ErrorBoundary>
    </Suspense>
  );

  // If the route is protected, wrap it with ProtectedRoute
  if (route.protected) {
    return <ProtectedRoute>{element}</ProtectedRoute>;
  }

  return element;
};

// Create route elements with proper error boundaries and suspense
// Create routes from config with proper nesting
const routes = routeConfig.map((route) => {
  if (route.children) {
    return {
      ...route,
      element: createRouteElement(route),
      children: route.children.map((child) => ({
        ...child,
        element: createRouteElement(child),
      })),
    };
  }
  return {
    ...route,
    element: createRouteElement(route),
  };
});

const router = createBrowserRouter(routes);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
