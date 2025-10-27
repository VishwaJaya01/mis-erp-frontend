import { AppShell } from "../layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Clock, Play, Pause, Plus, CheckCircle2, Circle, Timer } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface HomeProps {
  role: "Employee" | "Supervisor" | "Manager";
}

export function Home({ role }: HomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AppShell activePage="home" breadcrumbs={["Home"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1>{getGreeting()}, Nuwan</h1>
            <p className="text-muted-foreground">{today}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {role === "Employee" && <EmployeeContent />}
            {role === "Supervisor" && <SupervisorContent />}
            {role === "Manager" && <ManagerContent />}
          </div>

          {/* Announcements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">New safety protocol updates</p>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm">Holiday schedule for November</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm">Team building event next week</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-sm">Q4 production targets released</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
                <Button variant="link" className="w-full">
                  View all
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function EmployeeContent() {
  return (
    <>
      {/* My Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Tasks</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="ghost" size="sm">This week</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Checkbox />
            <div className="flex-1">
              <p className="text-sm">Complete #1043 material inspection</p>
              <p className="text-xs text-muted-foreground">Order #1043 • APEX Garments</p>
            </div>
            <Badge variant="secondary">In progress</Badge>
            <Badge variant="outline">Due today</Badge>
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Checkbox />
            <div className="flex-1">
              <p className="text-sm">QA review for #1044</p>
              <p className="text-xs text-muted-foreground">Order #1044 • Orion Tools</p>
            </div>
            <Badge>Todo</Badge>
            <Badge variant="outline">Tomorrow</Badge>
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
            <Checkbox />
            <div className="flex-1">
              <p className="text-sm">Update production drawings</p>
              <p className="text-xs text-muted-foreground">Order #1045 • Ceylon Plastics</p>
            </div>
            <Badge>Todo</Badge>
            <Badge variant="outline">Oct 30</Badge>
            <Button variant="ghost" size="sm">
              <Play className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </CardContent>
      </Card>

      {/* Quick Time Log */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Time Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="text-4xl font-mono">00:00:00</div>
            <Button size="lg" className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Start Timer
            </Button>
            <Button variant="link">Log manual time</Button>
          </div>
          <Separator />
          <div className="flex gap-4 justify-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Today</p>
              <p>6h 30m</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">This week</p>
              <p>32h 15m</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function SupervisorContent() {
  return (
    <>
      {/* Team Workload */}
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-around gap-4 px-4">
            {["Nuwan", "Jayani", "Imesh", "Kasun"].map((name, i) => (
              <div key={name} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full space-y-1">
                  <div className="bg-primary h-20 rounded-t" title="In progress" />
                  <div className="bg-primary/30 h-16 rounded-t" title="Completed" />
                </div>
                <p className="text-xs">{name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Time Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Time Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Avatar className="h-8 w-8">
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm">Nuwan</p>
                  <p className="text-xs text-muted-foreground">Oct 25, 2025</p>
                </div>
                <div>
                  <p className="text-sm">Task #1043</p>
                  <p className="text-xs text-muted-foreground">Material inspection</p>
                </div>
                <p className="text-sm">8h 30m</p>
                <p className="text-sm text-muted-foreground">Regular work</p>
              </div>
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="ghost">Reject</Button>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              <Avatar className="h-8 w-8">
                <AvatarFallback>J</AvatarFallback>
              </Avatar>
              <div className="flex-1 grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm">Jayani</p>
                  <p className="text-xs text-muted-foreground">Oct 25, 2025</p>
                </div>
                <div>
                  <p className="text-sm">Task #1044</p>
                  <p className="text-xs text-muted-foreground">QA review</p>
                </div>
                <p className="text-sm">7h 15m</p>
                <p className="text-sm text-muted-foreground">QA testing</p>
              </div>
              <Button size="sm">Approve</Button>
              <Button size="sm" variant="ghost">Reject</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Circle className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm">Review production schedule</p>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">I</AvatarFallback>
            </Avatar>
            <Badge variant="outline">Due today</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Circle className="h-4 w-4" />
            <div className="flex-1">
              <p className="text-sm">Team standup meeting</p>
            </div>
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">N</AvatarFallback>
            </Avatar>
            <Badge variant="outline">11:00 AM</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function ManagerContent() {
  return (
    <>
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Orders by Status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-24 w-24 mx-auto rounded-full border-8 border-primary relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span>24</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Revenue MTD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">LKR 8.5M</div>
            <p className="text-sm text-green-600">+12.5%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>On-time Completion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">94.2%</div>
            <p className="text-sm text-green-600">+2.1%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Quotes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">12</div>
            <p className="text-sm text-muted-foreground">-3 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button>Create Order</Button>
          <Button variant="secondary">Assign Task</Button>
          <Button variant="ghost">Generate Report</Button>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-6 gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <p className="text-sm font-mono">#1043</p>
              <p className="text-sm">APEX Garments</p>
              <p className="text-sm">Factory design</p>
              <Badge variant="secondary">Quoted</Badge>
              <p className="text-sm">LKR 245,000</p>
              <p className="text-sm text-muted-foreground">Oct 12, 2025</p>
            </div>
            
            <div className="grid grid-cols-6 gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <p className="text-sm font-mono">#1044</p>
              <p className="text-sm">Orion Tools</p>
              <p className="text-sm">Customer model</p>
              <Badge>In production</Badge>
              <p className="text-sm">LKR 1,150,000</p>
              <p className="text-sm text-muted-foreground">Oct 13, 2025</p>
            </div>
            
            <div className="grid grid-cols-6 gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <p className="text-sm font-mono">#1045</p>
              <p className="text-sm">Ceylon Plastics</p>
              <p className="text-sm">Factory design</p>
              <Badge variant="outline">Draft</Badge>
              <p className="text-sm">—</p>
              <p className="text-sm text-muted-foreground">Oct 14, 2025</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Due Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks Due Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-destructive rounded-full" />
            <div className="flex-1">
              <p className="text-sm">Complete #1043 material inspection</p>
            </div>
            <Badge variant="outline">Due today</Badge>
            <Button variant="ghost" size="sm">Assign</Button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-orange-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm">QA review for #1044</p>
            </div>
            <Badge variant="outline">Tomorrow</Badge>
            <Button variant="ghost" size="sm">Assign</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
