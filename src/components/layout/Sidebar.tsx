import { Home, ShoppingCart, ClipboardList, Users, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useRouter } from "../../lib/router";
import logoImage from "../../assets/b832ca2e23521f84cfef298c0f3c475a3cb6def2.png";

interface SidebarProps {
  activePage: string;
}

export function Sidebar({ activePage }: SidebarProps) {
  const { navigateTo, logout, userRole } = useRouter();

  // Define menu items based on role
  const getMenuItems = () => {
    const baseItems = [
      { id: "home", label: "Dashboard", icon: Home, roles: ["Employee", "Supervisor", "Manager"] },
      { id: "orders", label: "Orders", icon: ShoppingCart, roles: ["Supervisor", "Manager"] },
      { id: "work", label: "Work", icon: ClipboardList, roles: ["Employee", "Supervisor", "Manager"] },
      { id: "people", label: "People", icon: Users, roles: ["Employee", "Supervisor", "Manager"] },
    ];

    return baseItems.filter(item => item.roles.includes(userRole || ""));
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <img src={logoImage} alt="LPG Engineering" className="h-12 w-auto" />
        </div>
      </div>
      
      <Separator />
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigateTo(item.id as any)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
      
      <Separator />
      
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start" onClick={logout}>
          <LogOut className="mr-3 h-4 w-4" />
          Log Out
        </Button>
      </div>
    </div>
  );
}
