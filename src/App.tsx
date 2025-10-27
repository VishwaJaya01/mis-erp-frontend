import { Login } from "./components/pages/Login";
import { Home } from "./components/pages/Home";
import { Orders } from "./components/pages/Orders";
import { Work } from "./components/pages/Work";
import { People } from "./components/pages/People";
import { Profile } from "./components/pages/Profile";
import { Settings } from "./components/pages/Settings";
import { Toaster } from "./components/ui/sonner";
import { RouterProvider, useRouter } from "./lib/router";

function AppContent() {
  const { currentPage, userRole, navigateTo, setUserRole } = useRouter();

  const handleLogin = (role: string) => {
    setUserRole(role as "Employee" | "Supervisor" | "Manager");
    navigateTo("home");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return <Login onLogin={handleLogin} />;
      case "home":
        return <Home role={userRole!} />;
      case "orders":
        return <Orders />;
      case "work":
        return <Work />;
      case "people":
        return <People />;
      case "profile":
        return <Profile />;
      case "settings":
        return <Settings />;
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}