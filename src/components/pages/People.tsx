import { useState, type ChangeEvent } from 'react';
import { AppShell } from '../layout/AppShell';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Separator } from '../ui/separator';
import {
  Search,
  Users,
  Calendar,
  LayoutGrid,
  List,
  MoreVertical,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

const mockEmployees = [
  {
    id: 'E1',
    name: 'Nuwan',
    role: 'Production Supervisor',
    dept: 'Production',
    status: 'Active',
    email: 'nuwan@lpgeng.lk',
    phone: '+94 77 123 4567',
  },
  {
    id: 'E2',
    name: 'Jayani',
    role: 'QA Engineer',
    dept: 'QA',
    status: 'Active',
    email: 'jayani@lpgeng.lk',
    phone: '+94 77 234 5678',
  },
  {
    id: 'E3',
    name: 'Imesh',
    role: 'IT Specialist',
    dept: 'IT',
    status: 'Active',
    email: 'imesh@lpgeng.lk',
    phone: '+94 77 345 6789',
  },
  {
    id: 'E4',
    name: 'Tharushi',
    role: 'HR Manager',
    dept: 'HR',
    status: 'Active',
    email: 'tharushi@lpgeng.lk',
    phone: '+94 77 456 7890',
  },
  {
    id: 'E5',
    name: 'Kasun',
    role: 'Production Worker',
    dept: 'Production',
    status: 'On leave',
    email: 'kasun@lpgeng.lk',
    phone: '+94 77 567 8901',
  },
  {
    id: 'E6',
    name: 'Dinithi',
    role: 'Sales Executive',
    dept: 'Sales',
    status: 'Active',
    email: 'dinithi@lpgeng.lk',
    phone: '+94 77 678 9012',
  },
];

const mockLeaveRequests = [
  {
    id: 'L1',
    type: 'Annual',
    dates: 'Nov 03-05, 2025',
    days: '3',
    status: 'Pending',
    submitted: 'Oct 25, 2025',
  },
  {
    id: 'L2',
    type: 'Medical',
    dates: 'Oct 28, 2025 (AM)',
    days: '0.5',
    status: 'Approved',
    submitted: 'Oct 27, 2025',
  },
  {
    id: 'L3',
    type: 'Casual',
    dates: 'Oct 20, 2025',
    days: '1',
    status: 'Approved',
    submitted: 'Oct 18, 2025',
  },
];

const mockApprovals = [
  {
    id: 'A1',
    employee: 'Nuwan',
    type: 'Annual',
    dates: 'Nov 03-05, 2025',
    days: '3',
    submitted: 'Oct 25, 2025',
    status: 'Pending',
  },
  {
    id: 'A2',
    employee: 'Jayani',
    type: 'Medical',
    dates: 'Oct 28, 2025',
    days: '1',
    submitted: 'Oct 27, 2025',
    status: 'Pending',
  },
  {
    id: 'A3',
    employee: 'Kasun',
    type: 'Casual',
    dates: 'Nov 01, 2025',
    days: '1',
    submitted: 'Oct 26, 2025',
    status: 'Pending',
  },
];

export function People() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [peopleQuery, setPeopleQuery] = useState('');

  const employee = mockEmployees.find((e) => e.id === selectedEmployee);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'secondary';
      case 'On leave':
        return 'default';
      case 'Inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'default';
      case 'Approved':
        return 'secondary';
      case 'Rejected':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const pq = peopleQuery.trim().toLowerCase();
  const filteredEmployees = pq
    ? mockEmployees.filter((e) => {
        return (
          e.name.toLowerCase().includes(pq) ||
          e.role.toLowerCase().includes(pq) ||
          e.dept.toLowerCase().includes(pq)
        );
      })
    : mockEmployees;

  return (
    <AppShell activePage="people" breadcrumbs={['People']}>
      <Tabs defaultValue="team" className="space-y-6">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="my-leave">My Leave</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
        </TabsList>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, dept..."
                  className="pl-9"
                  value={peopleQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPeopleQuery(e.target.value)
                  }
                />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="qa">QA</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="leave">On leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('table')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredEmployees.map((emp) => (
                <Card
                  key={emp.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedEmployee(emp.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>{emp.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{emp.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {emp.role}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {emp.dept}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(emp.status) as any}>
                        {emp.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground space-y-1 w-full">
                        <p>{emp.email}</p>
                        <p>{emp.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((emp) => (
                    <TableRow
                      key={emp.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedEmployee(emp.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {emp.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          {emp.name}
                        </div>
                      </TableCell>
                      <TableCell>{emp.role}</TableCell>
                      <TableCell>{emp.dept}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(emp.status) as any}>
                          {emp.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{emp.email}</TableCell>
                      <TableCell className="text-sm">{emp.phone}</TableCell>
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

        {/* My Leave Tab */}
        <TabsContent value="my-leave" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* New Leave Request */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>New Leave Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <RadioGroup defaultValue="annual">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual">Annual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="casual" id="casual" />
                        <Label htmlFor="casual">Casual</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medical" id="medical" />
                        <Label htmlFor="medical">Medical</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unpaid" id="unpaid" />
                        <Label htmlFor="unpaid">Unpaid</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Day Type</Label>
                    <RadioGroup defaultValue="full">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="full" id="full" />
                        <Label htmlFor="full">Full Day</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="half" id="half" />
                        <Label htmlFor="half">Half Day</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <Textarea placeholder="Enter reason for leave..." />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => toast.success('Leave request submitted')}
                    >
                      Submit Request
                    </Button>
                    <Button variant="outline">Save as Draft</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Balances */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Leave Balances</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm">Annual Leave</p>
                      <p className="text-xs text-muted-foreground">
                        of 14 days
                      </p>
                    </div>
                    <p className="text-xl">8</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm">Casual Leave</p>
                      <p className="text-xs text-muted-foreground">of 7 days</p>
                    </div>
                    <p className="text-xl">5</p>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm">Medical Leave</p>
                      <p className="text-xs text-muted-foreground">of 7 days</p>
                    </div>
                    <p className="text-xl">6</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Policy Notes</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>• Annual leave must be requested 2 weeks in advance</p>
                  <p>• Medical leave requires certificate for 2+ days</p>
                  <p>• Maximum 3 consecutive casual leave days</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Leave History */}
          <Card>
            <CardHeader>
              <CardTitle>Leave History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono">{req.id}</TableCell>
                      <TableCell>{req.type}</TableCell>
                      <TableCell>{req.dates}</TableCell>
                      <TableCell>{req.days}</TableCell>
                      <TableCell>
                        <Badge variant={getLeaveStatusColor(req.status) as any}>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{req.submitted}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                        {req.status === 'Pending' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toast.success('Leave request cancelled')
                            }
                          >
                            Cancel
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee or request ID..."
                  className="pl-9"
                />
              </div>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {approval.employee[0]}
                          </AvatarFallback>
                        </Avatar>
                        {approval.employee}
                      </div>
                    </TableCell>
                    <TableCell>{approval.type}</TableCell>
                    <TableCell>{approval.dates}</TableCell>
                    <TableCell>{approval.days}</TableCell>
                    <TableCell>{approval.submitted}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getLeaveStatusColor(approval.status) as any}
                      >
                        {approval.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            toast.success(
                              `Approved leave request for ${approval.employee}`
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            toast.error(
                              `Declined leave request for ${approval.employee}`
                            )
                          }
                        >
                          Decline
                        </Button>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Employee Profile Drawer */}
      <Sheet
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <SheetContent className="w-[500px]">
          <SheetHeader>
            <SheetTitle>Employee Profile</SheetTitle>
          </SheetHeader>

          {employee && (
            <div className="mt-6 space-y-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-2xl">
                    {employee.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {employee.role}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employee.dept}
                  </p>
                </div>
                <Badge variant={getStatusColor(employee.status) as any}>
                  {employee.status}
                </Badge>
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>

              <Separator />

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="leave">Leave</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm mt-1">{employee.email}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm mt-1">{employee.phone}</p>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <p className="text-sm mt-1">{employee.dept}</p>
                    </div>
                    <div>
                      <Label>Manager</Label>
                      <p className="text-sm mt-1">Tharushi (HR Manager)</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="leave" className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">Leave Balances</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Annual</span>
                        <span>8 / 14 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Casual</span>
                        <span>5 / 7 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Medical</span>
                        <span>6 / 7 days</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm mb-2">Recent Leave</p>
                    <div className="space-y-2">
                      {mockLeaveRequests.slice(0, 3).map((req) => (
                        <div
                          key={req.id}
                          className="text-sm p-2 border rounded"
                        >
                          <div className="flex justify-between">
                            <span>{req.type}</span>
                            <Badge
                              variant={getLeaveStatusColor(req.status) as any}
                              className="text-xs"
                            >
                              {req.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {req.dates}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Textarea placeholder="Add notes about this employee..." />
                  <Button size="sm">Add Note</Button>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-sm">Previous Notes</p>
                    <p className="text-sm text-muted-foreground">
                      No notes yet
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
