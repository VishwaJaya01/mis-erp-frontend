import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { ShoppingCart, ClipboardList, Clock, Calendar, Circle, X } from "lucide-react";
import { useRouter } from "../../lib/router";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: "orders" | "tasks" | "time" | "leave";
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  action?: string;
  orderId?: string;
  taskId?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "orders",
    title: "Quote approved",
    description: "Order #1045 (APEX Garments)",
    timestamp: "12 min ago",
    unread: true,
    action: "View",
    orderId: "#1045",
  },
  {
    id: "n2",
    type: "tasks",
    title: "Task due today",
    description: "'CNC run 12' assigned to you",
    timestamp: "1 hour ago",
    unread: true,
    action: "Open",
    taskId: "T1",
  },
  {
    id: "n3",
    type: "time",
    title: "Time log submitted",
    description: "Nuwan (2h 15m) waiting review",
    timestamp: "2 hours ago",
    unread: true,
    action: "Approve",
  },
  {
    id: "n4",
    type: "leave",
    title: "Leave request",
    description: "Jayani (Annual 3 days) pending approval",
    timestamp: "3 hours ago",
    unread: false,
    action: "View",
  },
  {
    id: "n5",
    type: "orders",
    title: "Order moved to production",
    description: "Order #1044 (Orion Tools)",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "n6",
    type: "tasks",
    title: "Task completed",
    description: "'Material inspection' marked done",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: "n7",
    type: "time",
    title: "Time log approved",
    description: "Your time entry (8h 30m) has been approved",
    timestamp: "2 days ago",
    unread: false,
  },
];

interface NotificationBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationBar({ open, onOpenChange }: NotificationBarProps) {
  const { navigateTo, permissions } = useRouter();
  const [filter, setFilter] = useState<"all" | "orders" | "tasks" | "time" | "leave">("all");
  const [notifications, setNotifications] = useState(mockNotifications);

  const getIcon = (type: string) => {
    switch (type) {
      case "orders":
        return <ShoppingCart className="h-4 w-4" />;
      case "tasks":
        return <ClipboardList className="h-4 w-4" />;
      case "time":
        return <Clock className="h-4 w-4" />;
      case "leave":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    toast.success("All notifications marked as read");
  };

  const handleDismiss = (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent notification click
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success("Notification dismissed");
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(
      notifications.map((n) => (n.id === notification.id ? { ...n, unread: false } : n))
    );

    // Navigate based on type
    switch (notification.type) {
      case "orders":
        navigateTo("orders");
        onOpenChange(false);
        toast.info("Opening order details...");
        break;
      case "tasks":
        navigateTo("work");
        onOpenChange(false);
        toast.info("Opening task...");
        break;
      case "time":
        if (permissions.canReviewTime) {
          navigateTo("work");
          onOpenChange(false);
          toast.info("Opening time review...");
        }
        break;
      case "leave":
        if (permissions.canSeeLeaveApprovals) {
          navigateTo("people");
          onOpenChange(false);
          toast.info("Opening leave approvals...");
        }
        break;
    }
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:w-[480px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                Mark all as read
              </Button>
              <Button
                variant="link"
                size="sm"
                className="px-0"
                onClick={() => {
                  navigateTo("settings");
                  onOpenChange(false);
                }}
              >
                Preferences
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Filters */}
        <div className="px-6 py-3 border-b">
          <div className="flex gap-2">
            <Button
              variant={filter === "all" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All
              {filter === "all" && unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0 min-w-5 h-5">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={filter === "orders" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("orders")}
            >
              Orders
            </Button>
            <Button
              variant={filter === "tasks" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("tasks")}
            >
              Tasks
            </Button>
            <Button
              variant={filter === "time" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("time")}
            >
              Time
            </Button>
            <Button
              variant={filter === "leave" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter("leave")}
            >
              Leave
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <ScrollArea className="flex-1">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Circle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">You're all caught up</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 hover:bg-accent cursor-pointer transition-colors ${
                    notification.unread ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3">
                    {notification.unread && (
                      <div className="flex-shrink-0 mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    )}
                    {!notification.unread && <div className="w-2" />}
                    <div className="flex-shrink-0 mt-0.5 p-2 rounded-md bg-muted">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {notification.action && (
                            <Button variant="outline" size="sm">
                              {notification.action}
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e) => handleDismiss(e, notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <>
            <Separator />
            <div className="px-6 py-3">
              <Button variant="ghost" className="w-full" size="sm">
                View older
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
