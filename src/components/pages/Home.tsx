import { AppShell } from "../layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Clock, Play, Pause, Plus, CheckCircle2, Circle, Timer } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface HomeProps {
  role: "Employee" | "Supervisor" | "Manager";
}

export function Home({ role }: HomeProps) {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'New safety protocol updates', time: '2 hours ago', isNew: true },
    { id: '2', title: 'Holiday schedule for November', time: '1 day ago', isNew: false },
    { id: '3', title: 'Team building event next week', time: '3 days ago', isNew: false },
    { id: '4', title: 'Q4 production targets released', time: '1 week ago', isNew: false }
  ]);

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

  const handleViewAnnouncement = async (id: string, title: string) => {
    try {
      toast.info(`Viewing: ${title}`);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Mark as read when viewed
      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? { ...ann, isNew: false } : ann)
      );
    } catch (error) {
      console.error("View announcement error:", error);
      toast.error("Failed to load announcement. Please try again.");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      setAnnouncements(prev => 
        prev.map(ann => ann.id === id ? { ...ann, isNew: false } : ann)
      );
      toast.success("Marked as read");
    } catch (error) {
      console.error("Mark as read error:", error);
      toast.error("Failed to mark as read. Please try again.");
    }
  };

  const handleViewAllAnnouncements = () => {
    toast.info("Opening announcements page...");
  };

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
                {announcements.map((announcement, index) => (
                  <div key={announcement.id}>
                    {index > 0 && <Separator />}
                    <div 
                      className="space-y-1 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-colors"
                      onClick={() => handleViewAnnouncement(announcement.id, announcement.title)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm">{announcement.title}</p>
                        {announcement.isNew && (
                          <Badge 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(announcement.id);
                            }}
                          >
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{announcement.time}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="link" 
                  className="w-full"
                  onClick={handleViewAllAnnouncements}
                >
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
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [taskFilter, setTaskFilter] = useState<'today' | 'week'>('today');
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Complete #1043 material inspection', order: '#1043', customer: 'APEX Garments', status: 'In progress', due: 'Due today', completed: false },
    { id: '2', title: 'QA review for #1044', order: '#1044', customer: 'Orion Tools', status: 'Todo', due: 'Tomorrow', completed: false },
    { id: '3', title: 'Update production drawings', order: '#1045', customer: 'Ceylon Plastics', status: 'Todo', due: 'Oct 30', completed: false }
  ]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  // Handle task filter change
  const handleFilterChange = (filter: 'today' | 'week') => {
    setTaskFilter(filter);
    toast.info(`Showing tasks for ${filter === 'today' ? 'today' : 'this week'}`);
  };

  // Handle task completion
  const handleTaskComplete = (taskId: string, checked: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: checked, status: checked ? 'Done' : 'Todo' } : task
    ));
    toast.success(checked ? 'Task marked as complete' : 'Task marked as incomplete');
  };

  // Handle task timer start
  const handleStartTaskTimer = (taskTitle: string) => {
    if (!timerRunning) {
      setTimerRunning(true);
      toast.success(`Timer started for: ${taskTitle}`);
    } else {
      toast.info('Timer is already running. Stop current timer first.');
    }
  };

  // Handle create task
  const handleCreateTask = () => {
    toast.info('Create task dialog - Coming soon');
  };

  // Handle manual time log
  const handleManualTimeLog = () => {
    toast.info('Manual time log dialog - Coming soon');
  };

  return (
    <>
      {/* My Tasks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>My Tasks</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant={taskFilter === 'today' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => handleFilterChange('today')}
              >
                Today
              </Button>
              <Button 
                variant={taskFilter === 'week' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => handleFilterChange('week')}
              >
                This week
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={(checked) => handleTaskComplete(task.id, checked as boolean)}
              />
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground">{task.order} • {task.customer}</p>
              </div>
              <Badge variant={task.status === 'In progress' ? 'default' : 'outline'} className="mr-2">
                {task.status}
              </Badge>
              <Badge variant="outline" className="mr-2">{task.due}</Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleStartTaskTimer(task.title)}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Start timer</TooltipContent>
              </Tooltip>
            </div>
          ))}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleCreateTask}
          >
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
            <div className="text-4xl font-mono">{formatTime(timerSeconds)}</div>
            <Button 
              size="lg" 
              className="w-full"
              onClick={() => setTimerRunning(!timerRunning)}
            >
              {timerRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Timer
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Timer
                </>
              )}
            </Button>
            <Button 
              variant="link"
              onClick={handleManualTimeLog}
            >
              Log manual time
            </Button>
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
  const [timeApprovals, setTimeApprovals] = useState([
    { id: 1, name: 'Nuwan', initial: 'N', date: 'Oct 25, 2025', task: 'Task #1043', taskDesc: 'Material inspection', hours: '8h 30m', type: 'Regular work' },
    { id: 2, name: 'Jayani', initial: 'J', date: 'Oct 25, 2025', task: 'Task #1044', taskDesc: 'QA review', hours: '7h 15m', type: 'QA testing' }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review production schedule', assignee: 'I', due: 'Due today', completed: false },
    { id: 2, title: 'Team standup meeting', assignee: 'N', due: '11:00 AM', completed: false }
  ]);

  const handleApproveTime = (approvalId: number) => {
    const approval = timeApprovals.find(a => a.id === approvalId);
    if (approval) {
      toast.success(`Approved ${approval.hours} for ${approval.name}`);
      setTimeApprovals(timeApprovals.filter(a => a.id !== approvalId));
    }
  };

  const handleRejectTime = (approvalId: number) => {
    const approval = timeApprovals.find(a => a.id === approvalId);
    if (approval) {
      toast.error(`Rejected ${approval.hours} for ${approval.name}`);
      setTimeApprovals(timeApprovals.filter(a => a.id !== approvalId));
    }
  };

  const handleToggleTask = (taskId: number, checked: boolean) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: checked } : task
    ));
    toast.success(checked ? "Task marked as complete" : "Task marked as incomplete");
  };

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
            {timeApprovals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No pending approvals</p>
            ) : (
              timeApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{approval.initial}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm">{approval.name}</p>
                      <p className="text-xs text-muted-foreground">{approval.date}</p>
                    </div>
                    <div>
                      <p className="text-sm">{approval.task}</p>
                      <p className="text-xs text-muted-foreground">{approval.taskDesc}</p>
                    </div>
                    <p className="text-sm">{approval.hours}</p>
                    <p className="text-sm text-muted-foreground">{approval.type}</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => handleApproveTime(approval.id)}
                  >
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleRejectTime(approval.id)}
                  >
                    Reject
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <Checkbox 
                checked={task.completed}
                onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
              />
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
              </div>
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
              </Avatar>
              <Badge variant="outline" className="ml-2">{task.due}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

function ManagerContent() {
  const [recentOrders] = useState([
    { id: '#1043', client: 'APEX Garments', project: 'Factory design', status: 'Quoted', amount: 'LKR 245,000', date: 'Oct 12, 2025' },
    { id: '#1044', client: 'Orion Tools', project: 'Customer model', status: 'In production', amount: 'LKR 1,150,000', date: 'Oct 13, 2025' },
    { id: '#1045', client: 'Ceylon Plastics', project: 'Factory design', status: 'Draft', amount: '—', date: 'Oct 14, 2025' }
  ]);

  const [dueTasks] = useState([
    { id: 1, title: 'Complete #1043 material inspection', due: 'Due today', priority: 'high' },
    { id: 2, title: 'QA review for #1044', due: 'Tomorrow', priority: 'medium' }
  ]);

  const handleCreateOrder = () => {
    toast.info("Create Order dialog will be added in next phase");
  };

  const handleAssignTask = () => {
    toast.info("Assign Task dialog will be added in next phase");
  };

  const handleGenerateReport = () => {
    toast.info("Generate Report feature coming soon");
  };

  const handleOrderClick = (orderId: string) => {
    toast.success(`Opening order ${orderId} details`);
  };

  const handleAssignDueTask = (taskTitle: string) => {
    toast.success(`Opening assignment dialog for: ${taskTitle}`);
  };

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
          <Button onClick={handleCreateOrder}>Create Order</Button>
          <Button variant="secondary" onClick={handleAssignTask}>Assign Task</Button>
          <Button variant="ghost" onClick={handleGenerateReport}>Generate Report</Button>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div 
                key={order.id}
                className="grid grid-cols-6 gap-4 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => handleOrderClick(order.id)}
              >
                <p className="text-sm font-mono">{order.id}</p>
                <p className="text-sm">{order.client}</p>
                <p className="text-sm">{order.project}</p>
                <Badge variant={order.status === 'In production' ? 'default' : 'outline'}>
                  {order.status}
                </Badge>
                <p className="text-sm">{order.amount}</p>
                <p className="text-sm text-muted-foreground">{order.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Due Soon */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks Due Soon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {dueTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-destructive' : 'bg-orange-500'}`} />
              <div className="flex-1">
                <p className="text-sm">{task.title}</p>
              </div>
              <Badge variant="outline" className="mr-2">{task.due}</Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleAssignDueTask(task.title)}
              >
                Assign
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}
