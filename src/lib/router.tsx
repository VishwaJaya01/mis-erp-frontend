import { createContext, useContext, useState, ReactNode } from "react";

type Page = "login" | "home" | "orders" | "work" | "people" | "profile" | "settings";
type UserRole = "Employee" | "Supervisor" | "Manager" | null;

interface RolePermissions {
  canCreateOrder: boolean;
  canEditQuote: boolean;
  canApproveQuoteToProduction: boolean;
  canViewOrders: boolean;
  canSeeAllJobs: boolean;
  canReviewTime: boolean;
  canSeeLeaveApprovals: boolean;
  showAnnouncements: boolean;
}

interface RouterContextType {
  currentPage: Page;
  userRole: UserRole;
  permissions: RolePermissions;
  navigateTo: (page: Page) => void;
  setUserRole: (role: UserRole) => void;
  logout: () => void;
}

const getPermissions = (role: UserRole): RolePermissions => {
  switch (role) {
    case "Manager":
      return {
        canCreateOrder: true,
        canEditQuote: true,
        canApproveQuoteToProduction: true,
        canViewOrders: true,
        canSeeAllJobs: true,
        canReviewTime: true,
        canSeeLeaveApprovals: true,
        showAnnouncements: true,
      };
    case "Supervisor":
      return {
        canCreateOrder: false,
        canEditQuote: false,
        canApproveQuoteToProduction: false,
        canViewOrders: true,
        canSeeAllJobs: true,
        canReviewTime: true,
        canSeeLeaveApprovals: true,
        showAnnouncements: true,
      };
    case "Employee":
      return {
        canCreateOrder: false,
        canEditQuote: false,
        canApproveQuoteToProduction: false,
        canViewOrders: true,
        canSeeAllJobs: false,
        canReviewTime: false,
        canSeeLeaveApprovals: false,
        showAnnouncements: true,
      };
    default:
      return {
        canCreateOrder: false,
        canEditQuote: false,
        canApproveQuoteToProduction: false,
        canViewOrders: false,
        canSeeAllJobs: false,
        canReviewTime: false,
        canSeeLeaveApprovals: false,
        showAnnouncements: false,
      };
  }
};

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [userRole, setUserRole] = useState<UserRole>(null);
  const permissions = getPermissions(userRole);

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  const logout = () => {
    setUserRole(null);
    setCurrentPage("login");
  };

  return (
    <RouterContext.Provider
      value={{ currentPage, userRole, permissions, navigateTo, setUserRole, logout }}
    >
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}