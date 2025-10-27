import { useState } from "react";
import { AppShell } from "../layout/AppShell";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import { Search, Play, Pause, Plus, MoreVertical, Clock, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner";
import { useRouter } from "../../lib/router";

const mockTasks = [
  { id: "T1", title: "Complete #1043 material inspection", order: "#1043", customer: "APEX Garments", status: "In progress", priority: "High", due: "Due today", assignee: "Nuwan", time: "1h 35m" },
  { id: "T2", title: "QA review for #1044", order: "#1044", customer: "Orion Tools", status: "Todo", priority: "Medium", due: "Tomorrow", assignee: "Jayani", time: "0h 0m" },
  { id: "T3", title: "Update production drawings", order: "#1045", customer: "Ceylon Plastics", status: "Todo", priority: "Low", due: "Oct 30", assignee: "Imesh", time: "0h 0m" },
  { id: "T4", title: "Final assembly review", order: "#1042", customer: "Lanka Industries", status: "In progress", priority: "High", due: "Due today", assignee: "Kasun", time: "3h 20m" },
];

const mockTimeLogs = [
  { id: "TL1", date: "Oct 27, 2025", task: "Material inspection #1043", start: "09:00 AM", end: "11:30 AM", duration: "2h 30m", notes: "Completed initial inspection", status: "Submitted" },
  { id: "TL2", date: "Oct 27, 2025", task: "Production drawings #1045", start: "01:00 PM", end: "03:45 PM", duration: "2h 45m", notes: "Updated CAD files", status: "Draft" },
  { id: "TL3", date: "Oct 26, 2025", task: "QA review #1044", start: "10:00 AM", end: "12:30 PM", duration: "2h 30m", notes: "Found minor issues", status: "Approved" },
  { id: "TL4", date: "Oct 26, 2025", task: "Assembly #1042", start: "02:00 PM", end: "05:00 PM", duration: "3h 0m", notes: "Regular work", status: "Approved" },
];

const mockReviewItems = [
  { id: "R1", employee: "Nuwan", date: "Oct 25, 2025", task: "Task #1043", duration: "8h 30m", notes: "Regular work", status: "Pending" },
  { id: "R2", employee: "Jayani", date: "Oct 25, 2025", task: "Task #1044", duration: "7h 15m", notes: "QA testing", status: "Pending" },
  { id: "R3", employee: "Imesh", date: "Oct 24, 2025", task: "Task #1045", duration: "6h 45m", notes: "CAD work", status: "Pending" },
];

export function Work() {
  const { permissions } = useRouter();
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState("00:00:00");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo": return "outline";
      case "In progress": return "default";
      case "Blocked": return "destructive";
      case "Done": return "secondary";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-destructive";
      case "Medium": return "bg-orange-500";
      case "Low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const kanbanColumns = {
    unassigned: mockTasks.filter(t => !t.assignee),
    inprogress: mockTasks.filter(t => t.status === "In progress"),
    qa: [],
    completed: mockTasks.filter(t => t.status === "Done"),
  };

  return (
    <AppShell activePage="work" breadcrumbs={["Work"]}>
      <Tabs defaultValue="my-tasks" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="all-jobs">All Jobs</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
        </TabsList>

        {/* My Tasks Tab */}
        <TabsContent value="my-tasks" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search tasks..." className="pl-9" />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="inprogress">In progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => setShowNewTask(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Task
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                {mockTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedTask(task.id)}
                  >
                    <Checkbox onClick={(e) => e.stopPropagation()} />
                    <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <p className="text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.order} • {task.customer}
                      </p>
                    </div>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {task.assignee[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Badge variant={getStatusColor(task.status) as any}>{task.status}</Badge>
                    <Badge variant="outline">{task.due}</Badge>
                    <span className="text-sm text-muted-foreground">{task.time}</span>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Jobs Tab */}
        <TabsContent value="all-jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                Kanban
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                List
              </Button>
            </div>
            <div className="flex gap-3">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="inprogress">In progress</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="nuwan">Nuwan</SelectItem>
                  <SelectItem value="jayani">Jayani</SelectItem>
                  <SelectItem value="imesh">Imesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {viewMode === "kanban" ? (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Unassigned</CardTitle>
                  <CardDescription>{kanbanColumns.unassigned.length} tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockTasks.slice(0, 1).map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className={`h-2 w-2 rounded-full mt-1 ${getPriorityColor(task.priority)}`} />
                          <p className="text-sm flex-1">{task.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{task.order} • {task.customer}</p>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{task.due}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">In Progress</CardTitle>
                  <CardDescription>{kanbanColumns.inprogress.length} tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {kanbanColumns.inprogress.map((task) => (
                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <div className={`h-2 w-2 rounded-full mt-1 ${getPriorityColor(task.priority)}`} />
                          <p className="text-sm flex-1">{task.title}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{task.order} • {task.customer}</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">{task.assignee[0]}</AvatarFallback>
                          </Avatar>
                          <Badge variant="outline" className="text-xs">{task.due}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">QA</CardTitle>
                  <CardDescription>0 tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Completed</CardTitle>
                  <CardDescription>0 tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Task</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell>{task.title}</TableCell>
                      <TableCell className="font-mono">{task.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{task.assignee[0]}</AvatarFallback>
                          </Avatar>
                          {task.assignee}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(task.status) as any}>{task.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          {task.priority}
                        </div>
                      </TableCell>
                      <TableCell>{task.due}</TableCell>
                      <TableCell>{task.time}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Time Tab */}
        <TabsContent value="time" className="space-y-6">
          {/* Log Time */}
          <Card>
            <CardHeader>
              <CardTitle>Log Time</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-6 items-center">
                <div className="flex-1">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-mono mb-3">{timerValue}</div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t1">Material inspection #1043</SelectItem>
                        <SelectItem value="t2">QA review #1044</SelectItem>
                        <SelectItem value="t3">Production drawings #1045</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setTimerRunning(!timerRunning);
                      if (!timerRunning) {
                        toast.success("Timer started");
                      } else {
                        toast.success("Timer stopped");
                      }
                    }}
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
                </div>

                <Separator orientation="vertical" className="h-32" />

                <div className="flex-1 space-y-3">
                  <p className="text-sm">Manual Entry</p>
                  <div className="space-y-2">
                    <Input type="date" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="t1">Material inspection #1043</SelectItem>
                        <SelectItem value="t2">QA review #1044</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Duration (e.g., 2h 30m)" />
                    <Input placeholder="Notes" />
                    <Button className="w-full">Add Entry</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-6 justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Today Total</p>
                  <p className="text-xl">5h 15m</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">This Week Total</p>
                  <p className="text-xl">32h 45m</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Time Logs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>My Time Logs</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Previous Week</Button>
                  <Button variant="outline" size="sm">Next Week</Button>
                  <Button variant="outline" size="sm">Export CSV</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTimeLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.date}</TableCell>
                      <TableCell>{log.task}</TableCell>
                      <TableCell>{log.start}</TableCell>
                      <TableCell>{log.end}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.notes}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.status === "Approved" ? "secondary" :
                            log.status === "Draft" ? "outline" : "default"
                          }
                        >
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {log.status === "Draft" && (
                          <Button size="sm" onClick={() => toast.success("Time log submitted")}>
                            Submit
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Review Time */}
          <Card>
            <CardHeader>
              <CardTitle>Review Time</CardTitle>
              <CardDescription>Approve or reject time entries from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReviewItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{item.employee[0]}</AvatarFallback>
                          </Avatar>
                          {item.employee}
                        </div>
                      </TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.task}</TableCell>
                      <TableCell>{item.duration}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.notes}</TableCell>
                      <TableCell>
                        <Badge variant="default">{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => toast.success(`Approved time entry for ${item.employee}`)}>
                            Approve
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => toast.error(`Rejected time entry for ${item.employee}`)}>
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Task Dialog */}
      <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Task</DialogTitle>
            <DialogDescription>Create a new task</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Task title" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Task description" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuwan">Nuwan</SelectItem>
                  <SelectItem value="jayani">Jayani</SelectItem>
                  <SelectItem value="imesh">Imesh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTask(false)}>Cancel</Button>
            <Button onClick={() => {
              setShowNewTask(false);
              toast.success("Task created successfully");
            }}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}